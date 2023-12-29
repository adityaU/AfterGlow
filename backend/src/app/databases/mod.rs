use diesel::PgConnection;
use serde::{Deserialize, Serialize};

use crate::repository::models::{Database, SupportedDatabases};

pub fn verify_connection(_db: &Database) -> bool {
    true
}

#[derive(Deserialize, Serialize, Debug, Clone)]
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

pub fn get_db_config(
    conn: &mut PgConnection,
    db_id: i64,
) -> Result<(DBConfig, SupportedDatabases), String> {
    let db = Database::find(conn, db_id)
        .map_err(|_err| "database record was not found. May be it was deleted and a new database was created. Please reselect the database on questions page.".to_string())?;
    let config = db
        .config
        .clone()
        .ok_or_else(|| "Invalid database config".to_string())?;
    let db_config: DBConfig = serde_json::from_value(config).map_err(|err| err.to_string())?;
    let db_type = db
        .db_type
        .ok_or_else(|| "Invalid database type".to_string())?;
    Ok((db_config, db_type))
}
