pub mod adapters;
pub mod helpers;
pub mod payload_adapter;
pub mod query_builders;
pub mod query_terms;

use std::{
    collections::{HashMap},
    fmt,
    sync::{Arc, Mutex},
};

use deadpool_postgres::Pool;
use diesel::PgConnection;
use regex::Regex;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize, Serializer};

use serde::ser::SerializeStruct;

use crate::app::results::adapters::DBAdapter;
use crate::{
    app::{api_actions, results::payload_adapter::AdaptedPayload},
    repository::models::SupportedDatabases,
};

use self::{
    adapters::{postgres::PostgresAdapter},
    query_builders::postgres::DBValue,
};

use super::{api_actions::ApiActionResponse, databases::get_db_config, questions::config};

use lazy_static::lazy_static;

lazy_static! {
    static ref EMAIL: Regex = Regex::new(r"(?i)email").unwrap();
    static ref URL: Regex = Regex::new(r"(?i)url").unwrap();
    static ref TAG: Regex = Regex::new(r"(?i)(status|category|type|level|keyword|tag)").unwrap();
    static ref RATING: Regex = Regex::new(r"(?i)rating").unwrap();
    static ref PHONE: Regex = Regex::new(r"(?i)phone").unwrap();
    static ref CURRENCY: Regex = Regex::new(r"(?i)(amount|price)").unwrap();
}

#[derive(Debug, Serialize, Deserialize)]
pub struct QueryErrorDetails {
    pub message: String,
    pub final_query: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct QueryError {
    pub error: QueryErrorDetails,
}

impl fmt::Display for QueryError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "QueryError: {}", self.error.message)
    }
}

impl QueryError {
    pub fn new(message: String, final_query: String) -> Self {
        Self {
            error: QueryErrorDetails {
                message,
                final_query,
            },
        }
    }
}

#[derive(Debug, Clone)]
pub struct ConnectionPools {
    pub postgres: HashMap<String, Arc<Pool>>,
}

#[derive(Debug, Serialize)]
#[serde(untagged)]
pub enum ResultsResponse {
    ApiResponse(ApiActionResponse),
    QueryResponse(QueryResults),
}

#[derive(Debug)]
pub struct QueryResults {
    pub columns: Arc<Vec<String>>,
    pub column_details: Arc<HashMap<String, ColumnDetail>>,
    pub rows: Arc<Vec<Vec<DBValue>>>,
    pub final_query: Arc<String>,
    pub guessed_formats: Arc<Vec<Format>>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum Formats {
    Email,
    URL,
    Tag,
    Image,
    Checkbox,
    Phone,
    Currency,
}

#[derive(Debug, Serialize)]
pub struct Format {
    column: String,
    format: Formats,
}

impl Serialize for QueryResults {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut state = serializer.serialize_struct("QueryResults", 5)?;
        state.serialize_field("columns", &*self.columns)?;
        state.serialize_field("column_details", &*self.column_details)?;
        state.serialize_field("rows", &*self.rows)?;
        state.serialize_field("final_query", &*self.final_query)?;
        state.serialize_field("guessed_formats", &*self.guessed_formats)?;
        state.end()
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ColumnDetail {
    pub data_type: DataType,
    pub is_array: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum FormattableDBValue {
    Int32(Option<i32>),
    Int64(Option<i64>),
    Int16(Option<i16>),
    Int8(Option<i8>),
    Int128(Option<i128>),
    Strings(Option<String>),
    Float32(Option<f32>),
    Float64(Option<f64>),
    Decimal(Option<Decimal>),
    NotTaggable,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum DataType {
    String,
    Number,
    Bool,
    DateTime,
    Json,
}

impl ColumnDetail {
    pub fn new(data_type: DataType, is_array: bool) -> ColumnDetail {
        Self {
            data_type,
            is_array,
        }
    }
}

pub async fn fetch(
    conn: &mut PgConnection,
    payload: config::QuestionHumanSql,
    cps: &Arc<Mutex<ConnectionPools>>,
    user_id: i32,
    org_id: i64,
) -> Result<(ResultsResponse, Arc<String>), QueryError> {
    let db_id = match payload.database.as_ref().map(|db| &db.id) {
        Some(config::StringOrInt32::String(s)) => s.parse::<i32>().unwrap_or_default(),
        Some(config::StringOrInt32::Int(i)) => *i,
        None => 0, // default value
    };
    let adapted_payload = AdaptedPayload::new(payload.clone());

    if let AdaptedPayload::ApiAction {
        database: _,
        api_action,
        variables,
    } = adapted_payload
    {
        let api_action_response = api_actions::fetch_response(api_action, variables)
            .await
            .map_err(|err| QueryError::new(err.to_string(), "".to_string()))?;
        return Ok((
            ResultsResponse::ApiResponse(api_action_response),
            "".to_string().into(),
        ));
    }

    // let query = Postgres {
    //     inner: adapted_payload,
    // }
    // .build(conn, user_id, org_id)
    // .map_err(|err| QueryError::new(err, "".to_string()))?;

    let (db_config, db_type) = get_db_config(conn, db_id)
        .map_err(|err| QueryError::new(err.to_string(), "".to_string()))?;
    let db_adapter_response = match db_type {
        SupportedDatabases::Postgres => {
            PostgresAdapter::fetch_response(conn, db_config, cps, adapted_payload, user_id, org_id)
                .await?
        }
        _ => {
            return Err(QueryError::new(
                "Unsupported database type".to_string(),
                "".to_string(),
            ))
        }
    };

    let formats = find_formattable_columns(&db_adapter_response.column_details.clone());
    Ok((
        ResultsResponse::QueryResponse(QueryResults {
            columns: db_adapter_response.columns.clone(),
            column_details: db_adapter_response.column_details.clone(),
            rows: db_adapter_response.rows.clone(),
            final_query: db_adapter_response.final_query.clone(),
            guessed_formats: Arc::new(formats),
        }),
        db_adapter_response.adapted_query.clone(),
    ))
}

fn find_formattable_columns(column_details: &Arc<HashMap<String, ColumnDetail>>) -> Vec<Format> {
    let mut formats = vec![];
    for (col, cd) in column_details.iter() {
        if cd.is_array {
            continue;
        }
        match cd.data_type {
            DataType::String => add_string_formats(col, &mut formats),
            DataType::Number => add_numeric_formats(col, &mut formats),
            DataType::Bool => {
                formats.push(Format {
                    column: col.clone(),
                    format: Formats::Checkbox,
                });
            }
            _ => (),
        }
    }
    formats
}

fn add_string_formats(col: &String, formats: &mut Vec<Format>) {
    match_regex(EMAIL.clone(), col, Formats::Email, formats);
    match_regex(URL.clone(), col, Formats::URL, formats);
    match_regex(TAG.clone(), col, Formats::Tag, formats);
    match_regex(PHONE.clone(), col, Formats::Phone, formats);
}

fn add_numeric_formats(col: &String, formats: &mut Vec<Format>) {
    match_regex(CURRENCY.clone(), col, Formats::Currency, formats);
    match_regex(PHONE.clone(), col, Formats::Phone, formats);
    match_regex(TAG.clone(), col, Formats::Tag, formats);
}

fn match_regex(regex: Regex, col: &String, f: Formats, formats: &mut Vec<Format>) {
    if regex.is_match(col.to_lowercase().as_str()) {
        formats.push(Format {
            column: col.to_string(),
            format: f,
        });
        return;
    }
}
