use std::{
    error::Error as StdError,
    fmt::{self},
    sync::Arc,
};

use chrono::Utc;
use diesel::PgConnection;
use serde::{Deserialize, Serialize};

use crate::{
    app::{
        bg_jobs::{Error as BGJobError, JobEssentials, LongLivedData},
        databases::get_db_config,
        results::adapters::{postgres::PostgresAdapter, DBAdapter, DBColumn, DBTable},
    },
    repository::models::{Column, ColumnChangeset, TableChangeset},
};

use crate::repository::models::Table;

#[derive(Serialize, Deserialize, Debug)]
pub struct SyncDBJob {
    pub database_id: i32,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub enum SyncDBError {
    #[default]
    NoOP,
    UnableToFetchDBConfig(String),
    CouldNotGetAGPoolConnection(String),
    UnableToFetchDBSchema(String),
    UnableToUpdateTable(String),
    UnableToCreateTable(String),
    UnableToUpdateColumn(String),
    UnableToCreateColumn(String),
    UnableToDeleteOldTables(String),
    UnableToDeleteOldColumns(String),
    UnableToFetchPrimaryKeys(String),
    UnableToFetchForeignKeys(String),
    UnableToDeleteOldPrimaryKeys(String),
    UnableToUpdatePrimaryKey(String),
    UnableToUpdateForeignKeys(String),
    UnableToDeleteOldForeignKeys(String),
}

impl fmt::Display for SyncDBError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            SyncDBError::UnableToFetchDBConfig(err) => {
                write!(f, "Unable to fetch database config: {}", err)
            }
            SyncDBError::CouldNotGetAGPoolConnection(err) => {
                write!(f, "Could not get a connection from pool: {}", err)
            }
            SyncDBError::UnableToFetchDBSchema(err) => {
                write!(f, "Unable to fetch database schema: {}", err)
            }
            SyncDBError::UnableToUpdateTable(err) => {
                write!(f, "Unable to update table: {}", err)
            }
            SyncDBError::UnableToCreateTable(err) => {
                write!(f, "Unable to create table: {}", err)
            }
            SyncDBError::UnableToUpdateColumn(err) => {
                write!(f, "Unable to update column: {}", err)
            }
            SyncDBError::UnableToCreateColumn(err) => {
                write!(f, "Unable to create column: {}", err)
            }
            SyncDBError::UnableToDeleteOldTables(err) => {
                write!(f, "Unable to delete old tables: {}", err)
            }
            SyncDBError::UnableToDeleteOldColumns(err) => {
                write!(f, "Unable to delete old columns: {}", err)
            }
            SyncDBError::UnableToFetchPrimaryKeys(err) => {
                write!(f, "Unable to fetch primary keys: {}", err)
            }
            SyncDBError::UnableToFetchForeignKeys(err) => {
                write!(f, "Unable to fetch foreign keys: {}", err)
            }
            SyncDBError::UnableToDeleteOldPrimaryKeys(err) => {
                write!(f, "Unable to delete old primary keys: {}", err)
            }
            SyncDBError::UnableToUpdatePrimaryKey(err) => {
                write!(f, "Unable to update primary key: {}", err)
            }
            SyncDBError::UnableToUpdateForeignKeys(err) => {
                write!(f, "Unable to update foreign keys: {}", err)
            }
            SyncDBError::UnableToDeleteOldForeignKeys(err) => {
                write!(f, "Unable to delete old foreign keys: {}", err)
            }

            _ => write!(f, "SyncDBError"),
        }
    }
}

impl std::error::Error for SyncDBError {}
impl From<SyncDBError> for BGJobError {
    fn from(sync_db_error: SyncDBError) -> Self {
        BGJobError::SyncDBError(sync_db_error)
    }
}

#[async_trait::async_trait]
impl JobEssentials for SyncDBJob {
    async fn execute(&self, data: Arc<LongLivedData>) -> Result<(), BGJobError> {
        let mut conn = data
            .pool
            .get()
            .map_err(|err| SyncDBError::CouldNotGetAGPoolConnection(err.to_string()))?;
        let (db_config, _db_type) = get_db_config(&mut conn, self.database_id)
            .map_err(|err| SyncDBError::UnableToFetchDBConfig(err.to_string()))?;
        let schema = PostgresAdapter::get_schema(&data.conn_pools, db_config.clone())
            .await
            .map_err(|err| SyncDBError::UnableToFetchDBSchema(err.to_string()))?;

        let mut conn = data
            .pool
            .get()
            .map_err(|err| SyncDBError::CouldNotGetAGPoolConnection(err.to_string()))?;

        let table_names = &schema
            .iter()
            .map(|t| t.table_name.clone())
            .collect::<Vec<String>>();
        Table::delete_old_tables(&mut conn, table_names, self.database_id)
            .map_err(|err| SyncDBError::UnableToDeleteOldTables(err.to_string()))?;

        for table in &schema {
            Self::sync_table(&mut conn, table, self.database_id)?;
        }

        // let mut conn = data
        //     .pool
        //     .get()
        //     .map_err(|err| SyncDBError::CouldNotGetAGPoolConnection(err.to_string()))?;

        let primary_keys = PostgresAdapter::get_primary_keys(&data.conn_pools, db_config.clone())
            .await
            .map_err(|err| SyncDBError::UnableToFetchPrimaryKeys(err.to_string()))?;

        // let mut conn = data
        //     .pool
        //     .get()
        //     .map_err(|err| SyncDBError::CouldNotGetAGPoolConnection(err.to_string()))?;

        Table::delete_old_primary_keys(&mut conn, self.database_id)
            .map_err(|err| SyncDBError::UnableToDeleteOldPrimaryKeys(err.to_string()))?;

        Table::update_primary_keys(&mut conn, self.database_id, primary_keys)
            .map_err(|err| SyncDBError::UnableToUpdatePrimaryKey(err.to_string()))?;

        let foreign_keys = PostgresAdapter::get_fkeys(&data.conn_pools, db_config.clone())
            .await
            .map_err(|err| SyncDBError::UnableToFetchForeignKeys(err.to_string()))?;

        Table::delete_old_foreign_keys(&mut conn, self.database_id)
            .map_err(|err| SyncDBError::UnableToDeleteOldForeignKeys(err.to_string()))?;

        Table::update_foreign_keys(&mut conn, self.database_id, foreign_keys)
            .map_err(|err| SyncDBError::UnableToUpdateForeignKeys(err.to_string()))?;

        println!(
            "SyncDBJob::execute: Completed for database ID: {}",
            &self.database_id
        );
        Ok(())
    }
}

impl SyncDBJob {
    fn sync_table(
        conn: &mut PgConnection,
        table: &DBTable,
        database_id: i32,
    ) -> Result<(), SyncDBError> {
        let existing =
            Table::find_by_name_and_database_id(conn, table.table_name.clone(), database_id).ok();
        let table_id = match existing {
            Some(e) => {
                let updated_model = TableChangeset {
                    name: Some(table.table_name.clone()),
                    database_id: Some(database_id),
                    inserted_at: e.inserted_at,
                    updated_at: Utc::now().naive_utc(),
                    readable_table_name: Some(table.readable_table_name.clone()),
                    description: None,
                };
                Table::update(conn, e.id, updated_model)
                    .map_err(|err| {
                        SyncDBError::UnableToUpdateTable(format!(
                            "Table Name: {}, Error: {} ",
                            &table.table_name, err
                        ))
                    })?
                    .id
            }
            None => {
                let create_model = TableChangeset {
                    name: Some(table.table_name.clone()),
                    database_id: Some(database_id),
                    inserted_at: Utc::now().naive_utc(),
                    updated_at: Utc::now().naive_utc(),
                    readable_table_name: Some(table.readable_table_name.clone()),
                    description: None,
                };
                Table::create(conn, create_model)
                    .map_err(|err| {
                        SyncDBError::UnableToUpdateTable(format!(
                            "Table Name: {}, Error: {} ",
                            &table.table_name, err
                        ))
                    })?
                    .id
            }
        };

        let column_names = &table
            .columns
            .iter()
            .map(|t| t.name.clone())
            .collect::<Vec<String>>();
        Column::delete_old_columns(conn, column_names, table_id)
            .map_err(|err| SyncDBError::UnableToDeleteOldColumns(err.to_string()))?;

        for column in &table.columns {
            Self::sync_columns(conn, column, table_id)?;
        }

        Ok(())
    }

    fn sync_columns(
        conn: &mut PgConnection,
        column: &DBColumn,
        table_id: i32,
    ) -> Result<(), SyncDBError> {
        let existing = Column::find_by_name_and_table_id(conn, column.name.clone(), table_id).ok();
        match existing {
            Some(e) => {
                let updated_model = ColumnChangeset {
                    name: Some(column.name.clone()),
                    table_id: Some(table_id),
                    inserted_at: e.inserted_at,
                    updated_at: Utc::now().naive_utc(),
                    data_type: Some(column.data_type.clone()),
                    description: e.description,
                    primary_key: e.primary_key,
                };
                Column::update(conn, e.id, updated_model).map_err(|err| {
                    SyncDBError::UnableToUpdateColumn(format!(
                        "Column Name: {}, Error: {} ",
                        &column.name, err
                    ))
                })?;
            }
            None => {
                let create_model = ColumnChangeset {
                    name: Some(column.name.clone()),
                    table_id: Some(table_id),
                    inserted_at: Utc::now().naive_utc(),
                    updated_at: Utc::now().naive_utc(),
                    data_type: Some(column.data_type.clone()),
                    description: None,
                    primary_key: Some(false),
                };
                Column::create(conn, create_model).map_err(|err| {
                    SyncDBError::UnableToCreateColumn(format!(
                        "Column Name: {}, Error: {} ",
                        &column.name, err
                    ))
                })?;
            }
        }

        Ok(())
    }
}
