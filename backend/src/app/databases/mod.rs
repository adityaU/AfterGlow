use std::{
    sync::{Arc, Mutex},
};

use chrono::Utc;
use diesel::PgConnection;
use fancy_regex::Regex;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{
    app::results::adapters::{PermittedTables, RolePayload},
    controllers::database::ScopedDBPayload,
    repository::models::{Column, Database, DatabaseChangeset, SupportedDatabases, Table},
};

use super::results::{adapters::DBAdapter, ConnectionPools, QueryError};

pub fn verify_connection(_db: &Database) -> bool {
    true
}

#[derive(Deserialize, Serialize, Debug, Clone, Default)]
pub struct DBConfig {
    pub checkout_timeout: Option<u64>,
    pub db_name: String,
    pub host_port: u16,
    pub host_url: String,
    pub password: Option<String>,
    pub pool_size: Option<u32>,
    pub query_timeout: Option<u64>,
    pub username: String,
    pub base_db_id: Option<i64>,
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

pub async fn update_scoped_db(
    conn: &mut PgConnection,
    id: i64,
    payload: ScopedDBPayload,
    cps: &Arc<Mutex<ConnectionPools>>,
) -> Result<Database, QueryError> {
    let (_, _, base_db_adapter) = get_db_details(conn, &payload)?;
    let db = Database::find(conn, id).map_err(|err| QueryError::from(err.to_string()))?;
    let (tables, role_name) =
        make_permissions_schema(conn, &payload, db.name.unwrap_or_default().clone())?;

    let db = Database::find(conn, id).map_err(|err| QueryError::from(err.to_string()))?;
    let (db_config, _, _) = get_db_details(conn, &payload)?;
    let role_payload = RolePayload {
        role_name,
        permitted_tables: tables,
        password: db_config.password.clone().unwrap_or_default(),
    };

    base_db_adapter
        .update_role(role_payload.clone(), cps)
        .await?;
    let _db_config = db_config.clone();

    Ok(db)
}

pub async fn create_scoped_db(
    conn: &mut PgConnection,
    payload: ScopedDBPayload,
    cps: &Arc<Mutex<ConnectionPools>>,
) -> Result<Database, QueryError> {
    let (db_config, db_type, db_adapter) = get_db_details(conn, &payload)?;
    let (tables, role_name) = make_permissions_schema(conn, &payload, payload.name.clone())?;

    let create_payload = RolePayload {
        role_name,
        permitted_tables: tables,
        password: Uuid::new_v4().to_string(),
    };

    db_adapter.create_role(create_payload.clone(), cps).await?;
    let mut db_config = db_config.clone();
    db_config.password = Some(create_payload.password.clone());
    db_config.username = create_payload.role_name.clone();
    db_config.base_db_id = Some(payload.base_db_id);

    let db = Database::create(
        conn,
        DatabaseChangeset {
            name: Some(payload.name),
            db_type: Some(db_type),
            config: Some(serde_json::to_value(&db_config).unwrap_or_default()),
            inserted_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
            last_accessed_at: Some(Utc::now().naive_utc()),
            unique_identifier: Some(Uuid::new_v4()),
        },
    )
    .map_err(|err| QueryError::from(err.to_string()))?;

    Ok(db)
}

fn get_db_details(
    conn: &mut PgConnection,
    payload: &ScopedDBPayload,
) -> Result<(DBConfig, SupportedDatabases, Arc<dyn DBAdapter>), QueryError> {
    let (db_config, db_type) = get_db_config(conn, payload.base_db_id)?;
    if let SupportedDatabases::ApiClient = db_type {
        return Err(QueryError::from(
            "Database type is not supported".to_string(),
        ));
    }
    let db_adapter = db_type.get_adapter(db_config.clone());
    Ok((db_config, db_type, db_adapter))
}

fn make_permissions_schema(
    conn: &mut PgConnection,
    payload: &ScopedDBPayload,
    name: String,
) -> Result<(Vec<PermittedTables>, String), QueryError> {
    let table_ids: Vec<i64> = payload.tables.iter().map(|table| table.id).collect();
    let column_ids: Vec<i64> = payload
        .tables
        .iter()
        .flat_map(|table| table.columns.iter().map(|column| *column))
        .collect();
    let tables =
        Table::find_by_ids(conn, table_ids).map_err(|err| QueryError::from(err.to_string()))?;
    let columns =
        Column::find_by_ids(conn, column_ids).map_err(|err| QueryError::from(err.to_string()))?;
    let mut table_name_map = std::collections::HashMap::new();
    for table in tables {
        table_name_map.insert(table.id, table.name.unwrap_or_default());
    }
    let mut column_name_map = std::collections::HashMap::new();
    for column in columns {
        column_name_map.insert(column.id, column.name.unwrap_or_default());
    }
    let mut tables = vec![];
    for table in &payload.tables {
        if table.are_all_columns_selected || (!table.columns.is_empty()) {
            let table = PermittedTables {
                name: table_name_map
                    .get(&table.id)
                    .unwrap_or(&"".to_string())
                    .clone(),
                columns: table
                    .columns
                    .iter()
                    .map(|column_id| {
                        column_name_map
                            .get(column_id)
                            .unwrap_or(&"".to_string())
                            .clone()
                    })
                    .collect(),
            };
            tables.push(table);
        }
    }
    let role_name = Regex::new(r"[^a-zA-Z0-9]")
        .unwrap()
        .replace_all(
            format!("ag_restricted_{}_role", name)
                .to_lowercase()
                .as_str(),
            "_",
        )
        .to_string();
    Ok((tables, role_name))
}
