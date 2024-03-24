use std::{
    collections::HashMap,
    fmt,
    sync::{Arc, Mutex},
};

use chrono::{DateTime, NaiveDate, NaiveDateTime, NaiveTime, Utc};
use diesel::PgConnection;

use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;

use crate::{
    app::databases::DBConfig,
    repository::models::{SupportedDatabases},
};



use super::{
    payload_adapter::AdaptedPayload, query_builders::Queries, ColumnDetail, ConnectionPools,
    QueryError,
};

pub mod postgres;
pub mod redshift;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(untagged)]
pub enum DBValue {
    Bool(Option<bool>),
    Int32(Option<i32>),
    Int64(Option<i64>),
    Int16(Option<i16>),
    Int8(Option<i8>),
    Int128(Option<i128>),
    Float32(Option<f32>),
    Float64(Option<f64>),
    Json(Option<Value>),
    Strings(Option<String>),
    VecString(Option<Vec<String>>),
    VecInt32(Option<Vec<i32>>),
    VecInt64(Option<Vec<i64>>),
    VecInt16(Option<Vec<i16>>),
    VecInt8(Option<Vec<i8>>),
    VecInt128(Option<Vec<i128>>),
    VecFloat32(Option<Vec<f32>>),
    VecFloat64(Option<Vec<f64>>),
    VecJSON(Option<Vec<Value>>),
    VecBool(Option<Vec<bool>>),
    VecDate(Option<Vec<NaiveDate>>),
    VecTime(Option<Vec<NaiveTime>>),
    VecDateTime(Option<Vec<NaiveDateTime>>),
    VecUtcDateTime(Option<Vec<DateTime<Utc>>>),
    VecUUID(Option<Vec<Uuid>>),
    Date(Option<NaiveDate>),
    Time(Option<NaiveTime>),
    DateTime(Option<NaiveDateTime>),
    UtcDateTime(Option<DateTime<Utc>>),
    Uuid(Option<Uuid>),
    Decimal(Option<Decimal>),
    VecDecimal(Option<Vec<Decimal>>),
}

impl fmt::Display for DBValue {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            // For single values
            DBValue::Bool(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Int32(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Int64(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Int16(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Int8(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Int128(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Float32(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Float64(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Json(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Strings(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Date(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Time(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::DateTime(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::UtcDateTime(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Uuid(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Decimal(v) => write!(f, "{}", opt_to_string(v)),

            // For vector values
            DBValue::VecString(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecInt32(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecInt64(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecInt16(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecInt8(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecInt128(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecFloat32(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecFloat64(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecJSON(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecBool(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecDate(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecTime(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecDateTime(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecUtcDateTime(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecUUID(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecDecimal(v) => write!(f, "{}", vec_opt_to_string(v)),
        }
    }
}
// Helper function for single value variants
fn opt_to_string<T: ToString>(opt: &Option<T>) -> String {
    match opt {
        Some(val) => val.to_string(),
        None => "null".to_string(),
    }
}

// Helper function for vector value variants
fn vec_opt_to_string<T: ToString>(opt: &Option<Vec<T>>) -> String {
    match opt {
        Some(vec) => vec
            .iter()
            .map(|i| i.to_string())
            .collect::<Vec<String>>()
            .join(", "),
        None => "null".to_string(),
    }
}

impl SupportedDatabases {
    pub fn get_adapter(&self, db_config: DBConfig) -> Arc<dyn DBAdapter> {
        match self {
            SupportedDatabases::Postgres => Arc::new(postgres::PostgresAdapter::new(db_config)),
            SupportedDatabases::Redshift => Arc::new(redshift::RedshiftAdapter::new(db_config)),
            _ => unimplemented!(),
        }
    }
}

pub struct DBAdapterResponse {
    pub columns: Arc<Vec<String>>,
    pub rows: Arc<Vec<Vec<DBValue>>>,
    pub column_details: Arc<HashMap<String, ColumnDetail>>,
    pub final_query: Arc<String>,
    pub adapted_query: Arc<String>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct DBTable {
    pub table_name: String,
    pub readable_table_name: String,
    pub columns: Vec<DBColumn>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct DBColumn {
    pub name: String,
    pub data_type: String,
}

pub struct ForeignKey {
    pub table_name: String,
    pub column_name: String,
    pub foreign_table_name: String,
    pub foreign_column_name: String,
    pub relation_name: String,
}
pub struct PrimaryKey {
    pub table_name: String,
    pub column_name: String,
}

#[async_trait::async_trait]
pub trait DBAdapter: Send + Sync {
    async fn fetch_query_only(
        &self,
        conn: &mut PgConnection,
        adapted_payload: AdaptedPayload,
        user_id: i64,
        org_id: i64,
    ) -> Result<Queries, QueryError>;
    async fn fetch_response(
        &self,
        conn: &mut PgConnection,
        cps: &Arc<Mutex<ConnectionPools>>,
        adapted_payload: AdaptedPayload,
        user_id: i64,
        org_id: i64,
    ) -> Result<DBAdapterResponse, QueryError>;

    async fn get_schema(
        &self,
        cps: &Arc<Mutex<ConnectionPools>>,
    ) -> Result<Vec<DBTable>, QueryError>;
    async fn get_fkeys(
        &self,
        cps: &Arc<Mutex<ConnectionPools>>,
    ) -> Result<Vec<ForeignKey>, QueryError>;

    async fn get_primary_keys(
        &self,
        cps: &Arc<Mutex<ConnectionPools>>,
    ) -> Result<Vec<PrimaryKey>, QueryError>;
}
