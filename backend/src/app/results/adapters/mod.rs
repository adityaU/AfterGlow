use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

use diesel::PgConnection;
use serde::{Deserialize, Serialize};

use crate::app::databases::DBConfig;

use super::{payload_adapter::AdaptedPayload, ColumnDetail, ConnectionPools, DBValue, QueryError};

pub mod postgres;

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
pub trait DBAdapter {
    async fn fetch_response(
        conn: &mut PgConnection,
        db_config: DBConfig,
        cps: &Arc<Mutex<ConnectionPools>>,
        adapted_payload: AdaptedPayload,
        user_id: i32,
        org_id: i64,
    ) -> Result<DBAdapterResponse, QueryError>;

    async fn get_schema(
        cps: &Arc<Mutex<ConnectionPools>>,
        db_config: DBConfig,
    ) -> Result<Vec<DBTable>, QueryError>;
    async fn get_fkeys(
        cps: &Arc<Mutex<ConnectionPools>>,
        db_config: DBConfig,
    ) -> Result<Vec<ForeignKey>, QueryError>;

    async fn get_primary_keys(
        cps: &Arc<Mutex<ConnectionPools>>,
        db_config: DBConfig,
    ) -> Result<Vec<PrimaryKey>, QueryError>;
}
