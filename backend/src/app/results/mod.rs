pub mod adapters;
pub mod helpers;
pub mod payload_adapter;
pub mod query_builders;
pub mod query_terms;

use std::{
    collections::HashMap,
    fmt,
    sync::{Arc, Mutex},
};

use chrono::{NaiveDateTime, Utc};
use deadpool_postgres::Pool;
use diesel::PgConnection;
use regex::Regex;
use rust_decimal::Decimal;
use serde::{
    de::{self, MapAccess, Visitor},
    Deserialize, Deserializer, Serialize, Serializer,
};

use serde::ser::SerializeStruct;
use serde_json::from_value;

use crate::{
    app::results::adapters::{DBAdapter},
    repository::{models::ResultsCache},
};
use crate::{
    app::{api_actions, results::payload_adapter::AdaptedPayload},
};

use self::adapters::DBValue;

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
    pub original_query_columns: Arc<Vec<String>>,
    pub cache_updated_at: Option<NaiveDateTime>,
    pub cached_until: Option<NaiveDateTime>,
    pub from_cache: bool,
}

struct QueryResultsVisitor;

impl<'de> Visitor<'de> for QueryResultsVisitor {
    type Value = QueryResults;

    fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
        formatter.write_str("struct QueryResults")
    }

    fn visit_map<V>(self, mut map: V) -> Result<QueryResults, V::Error>
    where
        V: MapAccess<'de>,
    {
        let mut columns = None;
        let mut column_details = None;
        let mut rows = None;
        let mut final_query = None;
        let mut guessed_formats = None;
        let mut original_query_columns = None;
        let mut cache_updated_at = None;
        let mut cached_until = None;
        let mut from_cache = None;

        while let Some(key) = map.next_key::<String>()? {
            match key.as_str() {
                "columns" => {
                    columns = Some(map.next_value()?);
                }
                "column_details" => {
                    column_details = Some(map.next_value()?);
                }
                "rows" => {
                    rows = Some(map.next_value()?);
                }
                "final_query" => {
                    final_query = Some(map.next_value()?);
                }
                "guessed_formats" => {
                    guessed_formats = Some(map.next_value()?);
                }
                "original_query_columns" => {
                    original_query_columns = Some(map.next_value()?);
                }
                "cache_updated_at" => {
                    cache_updated_at = Some(map.next_value()?);
                }
                "cached_until" => {
                    cached_until = Some(map.next_value()?);
                }
                "from_cache" => {
                    from_cache = Some(map.next_value()?);
                }
                _ => {}
            }
        }

        let columns = columns.ok_or_else(|| de::Error::missing_field("columns"))?;
        let column_details =
            column_details.ok_or_else(|| de::Error::missing_field("column_details"))?;
        let rows = rows.ok_or_else(|| de::Error::missing_field("rows"))?;
        let final_query = final_query.ok_or_else(|| de::Error::missing_field("final_query"))?;
        let guessed_formats =
            guessed_formats.ok_or_else(|| de::Error::missing_field("guessed_formats"))?;
        let original_query_columns = original_query_columns
            .ok_or_else(|| de::Error::missing_field("original_query_columns"))?;
        let from_cache = from_cache.ok_or_else(|| de::Error::missing_field("from_cache"))?;

        Ok(QueryResults {
            columns: Arc::new(columns),
            column_details: Arc::new(column_details),
            rows: Arc::new(rows),
            final_query: Arc::new(final_query),
            guessed_formats: Arc::new(guessed_formats),
            original_query_columns: Arc::new(original_query_columns),
            cache_updated_at,
            cached_until,
            from_cache,
        })
    }
}

impl<'de> Deserialize<'de> for QueryResults {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        deserializer.deserialize_map(QueryResultsVisitor)
    }
}
#[derive(Debug, Serialize, Deserialize)]
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

#[derive(Debug, Serialize, Deserialize)]
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
        state.serialize_field("original_query_columns", &*self.original_query_columns)?;
        state.serialize_field("cache_updated_at", &self.cache_updated_at)?;
        state.serialize_field("cached_until", &self.cached_until)?;
        state.serialize_field("from_cache", &self.from_cache)?;
        state.end()
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
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

#[derive(Debug, Serialize, Deserialize, Clone)]
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

#[derive(Debug, Serialize, Deserialize)]
pub struct VizSettings {
    pub general: Option<VizGeneralSettings>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct VizGeneralSettings {
    pub cache_time_in_seconds: i64,
    pub can_viewers_change_query_terms: bool,
}

pub async fn fetch(
    conn: &mut PgConnection,
    payload: config::QuestionHumanSql,
    cps: &Arc<Mutex<ConnectionPools>>,
    user_id: i64,
    org_id: i64,
) -> Result<(ResultsResponse, Arc<String>), QueryError> {
    let db_id = match payload.database.as_ref().map(|db| &db.id) {
        Some(config::StringOrInt64::String(s)) => s.parse::<i64>().unwrap_or_default(),
        Some(config::StringOrInt64::Int(i)) => *i,
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

    let (viz_id, cache_time_in_seconds) = fetch_cache_time_and_viz_id(&payload);

    let (db_config, db_type) = get_db_config(conn, db_id)
        .map_err(|err| QueryError::new(err.to_string(), "".to_string()))?;
    let adapter = db_type.get_adapter(db_config.clone());

    if cache_time_in_seconds > 0 {
        let query = adapter
            .fetch_query_only(conn, adapted_payload.clone(), user_id, org_id)
            .await?;
        let results = ResultsCache::fetch_by_query(conn, query.final_query.clone(), viz_id).ok();
        if let Some(results) = results {
            match results {
                Some(results) => {
                    let res: Result<QueryResults, serde_json::Error> =
                        serde_json::from_value(results);
                    match res {
                        Ok(res) => {
                            return Ok((
                                ResultsResponse::QueryResponse(res),
                                query.adapted_query.into(),
                            ));
                        }
                        Err(_err) => {
                            return fetch_results_from_db(
                                adapter,
                                conn,
                                cps,
                                adapted_payload,
                                user_id,
                                org_id,
                                cache_time_in_seconds,
                                viz_id,
                            )
                            .await;
                        }
                    };
                }
                None => {
                    return fetch_results_from_db(
                        adapter,
                        conn,
                        cps,
                        adapted_payload,
                        user_id,
                        org_id,
                        cache_time_in_seconds,
                        viz_id,
                    )
                    .await;
                }
            };
        }
    }

    fetch_results_from_db(
        adapter,
        conn,
        cps,
        adapted_payload,
        user_id,
        org_id,
        cache_time_in_seconds,
        viz_id,
    )
    .await
}

async fn fetch_results_from_db(
    adapter: Arc<dyn DBAdapter>,
    conn: &mut PgConnection,
    cps: &Arc<Mutex<ConnectionPools>>,
    adapted_payload: AdaptedPayload,
    user_id: i64,
    org_id: i64,
    cache_time_in_seconds: i64,
    viz_id: i64,
) -> Result<(ResultsResponse, Arc<String>), QueryError> {
    let (original_query_columns, column_details) =
        fetch_original_query_columns(&adapted_payload, &adapter, conn, cps, user_id, org_id)
            .await?;

    let db_adapter_response = adapter
        .fetch_response(conn, cps, adapted_payload, user_id, org_id)
        .await?;
    let formats = find_formattable_columns(&db_adapter_response.column_details.clone());
    let mut query_results = QueryResults {
        columns: db_adapter_response.columns.clone(),
        column_details: find_column_details(column_details, &db_adapter_response),
        rows: db_adapter_response.rows.clone(),
        final_query: db_adapter_response.final_query.clone(),
        guessed_formats: Arc::new(formats),
        original_query_columns: match original_query_columns.is_none() {
            true => db_adapter_response.columns.clone(),
            false => original_query_columns.unwrap(),
        },
        cache_updated_at: None,
        cached_until: None,
        from_cache: false,
    };
    if cache_time_in_seconds > 0 {
        query_results.cache_updated_at = Some(Utc::now().naive_utc());
        query_results.cached_until =
            Some(Utc::now().naive_utc() + chrono::Duration::seconds(cache_time_in_seconds));
        query_results.from_cache = true;
        let res = serde_json::to_value(&query_results).map_err(|err| {
            QueryError::new(
                err.to_string(),
                db_adapter_response.adapted_query.clone().to_string(),
            )
        })?;
        ResultsCache::push_to_cache(
            conn,
            db_adapter_response.final_query.clone().to_string(),
            viz_id,
            res,
            cache_time_in_seconds,
        )
        .map_err(|err| {
            QueryError::new(
                err.to_string(),
                db_adapter_response.adapted_query.clone().to_string(),
            )
        })?;
    }

    query_results.from_cache = false;
    Ok((
        ResultsResponse::QueryResponse(query_results),
        db_adapter_response.adapted_query.clone(),
    ))
}

fn fetch_cache_time_and_viz_id(payload: &config::QuestionHumanSql) -> (i64, i64) {
    let viz = payload.visualization.clone().unwrap_or_default();

    let viz_id = viz.id.unwrap_or_default();
    if viz_id == 0 {
        return (0, 0);
    }

    let viz_settings = viz.settings.unwrap_or_default();

    let viz_settings: Option<VizSettings> = from_value(viz_settings).ok();

    let cache_time_in_settings = if let Some(viz_general_settings) = viz_settings {
        if let Some(viz_gen_settings) = viz_general_settings.general {
            viz_gen_settings.cache_time_in_seconds
        } else {
            0i64
        }
    } else {
        0i64
    };

    (viz_id, cache_time_in_settings)
}

fn find_column_details(
    column_details: Option<Arc<HashMap<String, ColumnDetail>>>,
    db_adapter_response: &adapters::DBAdapterResponse,
) -> Arc<HashMap<String, ColumnDetail>> {
    match column_details {
        None => db_adapter_response.column_details.clone(),
        Some(col_details) => {
            let mut col_details = (&*col_details).clone();
            for (k, v) in &*db_adapter_response.column_details {
                col_details.insert(k.clone(), v.clone());
            }
            println!("col_details: {:?}", col_details);
            Arc::new(col_details)
        }
    }
}

async fn fetch_original_query_columns(
    adapted_payload: &AdaptedPayload,
    adapter: &Arc<dyn DBAdapter>,
    conn: &mut PgConnection,
    cps: &Arc<Mutex<ConnectionPools>>,
    user_id: i64,
    org_id: i64,
) -> Result<
    (
        Option<Arc<Vec<String>>>,
        Option<Arc<HashMap<String, ColumnDetail>>>,
    ),
    QueryError,
> {
    Ok(
        match should_fetch_for_original_query_colums(adapted_payload) {
            true => {
                let mut limit_one_payload = adapted_payload.clone();
                set_limit_on_payload(&mut limit_one_payload, 1);
                let res = adapter
                    .fetch_response(conn, cps, limit_one_payload, user_id, org_id)
                    .await?;
                (Some(res.columns), Some(res.column_details))
            }
            false => (None, None),
        },
    )
}

fn set_limit_on_payload(adapted_payload: &mut AdaptedPayload, limit: i64) {
    match adapted_payload {
        AdaptedPayload::ApiAction {
            database: _,
            api_action: _,
            variables: _,
        } => (),
        AdaptedPayload::Raw {
            database: _,
            raw_query: _,
            variables: _,
            visualization_query_terms,
        } => {
            visualization_query_terms.groupings = vec![];
            visualization_query_terms.views = vec![];
            visualization_query_terms.limit = Some(limit);
        }
        AdaptedPayload::QB {
            database: _,
            question_query_terms: _,
            table: _,
            variables: _,
            visualization_query_terms,
        } => {
            visualization_query_terms.groupings = vec![];
            visualization_query_terms.views = vec![];
            visualization_query_terms.limit = Some(limit);
        }
    }
}

fn should_fetch_for_original_query_colums(adapted_payload: &AdaptedPayload) -> bool {
    match adapted_payload {
        AdaptedPayload::ApiAction {
            database: _,
            api_action: _,
            variables: _,
        } => false,
        AdaptedPayload::Raw {
            database: _,
            raw_query: _,
            variables: _,
            visualization_query_terms,
        } => {
            !(visualization_query_terms.groupings.is_empty()
                && visualization_query_terms.views.is_empty())
        }
        AdaptedPayload::QB {
            database: _,
            question_query_terms: _,
            table: _,
            variables: _,
            visualization_query_terms,
        } => {
            !(visualization_query_terms.groupings.is_empty()
                && visualization_query_terms.views.is_empty())
        }
    }
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
