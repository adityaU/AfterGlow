pub mod helpers;
pub mod payload_adapter;
pub mod query_builders;
pub mod query_terms;

use derive_more::Display;
use std::{
    collections::HashMap,
    fmt,
    rc::Rc,
    sync::{Arc, Mutex},
};

use actix_web::web::block;

use query_builders::postgres::QueryBuilder;

use diesel::PgConnection;
use r2d2::Pool;
use r2d2_postgres::PostgresConnectionManager;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tokio::time::timeout;
use tokio_postgres::{NoTls, Row};

use crate::{
    app::{
        api_actions,
        results::{
            helpers::hashed_db_credentials, payload_adapter::AdaptedPayload,
            query_builders::postgres::Postgres,
        },
    },
    repository::models::Database,
};

use self::query_builders::postgres::DBValue;

use super::{api_actions::ApiActionResponse, questions::config};

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
    pub postgres: HashMap<String, Arc<Pool<PostgresConnectionManager<NoTls>>>>,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct DBConfig {
    pub checkout_timeout: Option<u64>,
    pub db_name: String,
    pub host_port: u16,
    pub host_url: String,
    pub password: Option<String>,
    pub pool_size: Option<u32>,
    pub query_timeout: Option<u64>,
    pub username: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum ResultsResponse {
    ApiResponse(ApiActionResponse),
    QueryResponse(QueryResults),
}

#[derive(Debug, Serialize, Deserialize)]
pub struct QueryResults {
    columns: Vec<String>,
    rows: Vec<Vec<DBValue>>,
    final_query: String,
}

pub async fn fetch(
    conn: &mut PgConnection,
    payload: config::QuestionConfig,
    cps: &mut Arc<Mutex<ConnectionPools>>,
    user_id: i32,
    org_id: i64,
) -> Result<(ResultsResponse, String), QueryError> {
    let db_id = match payload.database.as_ref().map(|db| &db.id) {
        Some(config::StringOrInt32::String(s)) => s.parse::<i32>().unwrap_or_default(),
        Some(config::StringOrInt32::Int(i)) => *i,
        None => 0, // default value
    };
    let adapted_payload = AdaptedPayload::new(payload);

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
            "".to_string(),
        ));
    }

    let query = Postgres {
        inner: adapted_payload,
    }
    .build(conn, user_id, org_id)
    .map_err(|err| QueryError::new(err, "".to_string()))?;

    let db = Database::find(conn, db_id)
        .map_err(|_err| QueryError::new("database record was not found. May be it was deleted and a new database was created. Please reselect the database on questions page.".to_string(), "".to_string()))?;

    let config = db
        .config
        .clone()
        .ok_or_else(|| QueryError::new("Invalid database config".to_string(), "".to_string()))?;

    let db_config: DBConfig = serde_json::from_value(config)
        .map_err(|err| QueryError::new(err.to_string(), "".to_string()))?;
    let duration = std::time::Duration::from_secs(db_config.query_timeout.clone().unwrap_or(60));

    let key = hashed_db_credentials(&db);
    let mut connection_pools = cps.lock().unwrap();
    let pool: Arc<_> = match connection_pools.postgres.get(&key) {
        Some(p) => Arc::clone(p),
        None => {
            let p = Postgres::get_pool(db_config)
                .map_err(|err| QueryError::new(err.to_string(), "".to_string()))?;
            let rc = Arc::new(p);
            connection_pools
                .postgres
                .insert(hashed_db_credentials(&db), Arc::clone(&rc));
            Arc::clone(&rc)
        }
    };

    let final_query = query.final_query.clone();

    let row_results = timeout(duration, async {
        block(move || {
            let pool_conn = pool.get().map_err(|err| err.to_string());

            pool_conn
                .ok()
                .unwrap()
                .query(query.final_query.as_str(), &[])
                .map_err(|err| err.to_string())
        })
        .await
        .map_err(|err| err.to_string())
    })
    .await
    .map_err(|err| QueryError::new(err.to_string(), final_query.clone()))?
    .unwrap()
    .map_err(|err| QueryError::new(err.to_string(), final_query.clone()))?;

    let mut str_rows = vec![];

    if row_results.is_empty() {
        return Ok((
            ResultsResponse::QueryResponse(QueryResults {
                columns: vec![],
                rows: vec![],
                final_query,
            }),
            query.question_level_query,
        ));
    }

    let columns = row_results[0]
        .columns()
        .iter()
        .map(|col| col.name().to_string())
        .collect::<Vec<String>>();

    for row in &row_results {
        let str_row = Postgres::row_to_json(row);
        str_rows.push(str_row)
    }

    Ok((
        ResultsResponse::QueryResponse(QueryResults {
            columns,
            rows: str_rows,
            final_query,
        }),
        query.question_level_query,
    ))
}
