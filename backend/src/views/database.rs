use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::repository::models::{Database, SupportedDatabases};
#[derive(Debug, Deserialize, Serialize)]
pub struct DatabaseView {
    pub id: i64,
    pub name: Option<String>,
    pub db_type: Option<SupportedDatabases>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub last_accessed_at: Option<NaiveDateTime>,
    pub unique_identifier: Option<Uuid>,
}

impl DatabaseView {
    pub fn from_model(db: &Database) -> Self {
        Self {
            id: db.id,
            name: db.name.clone(),
            db_type: db.db_type.clone(),
            inserted_at: db.inserted_at,
            updated_at: db.updated_at,
            last_accessed_at: db.last_accessed_at,
            unique_identifier: db.unique_identifier,
        }
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct DetailedDatabaseView {
    pub id: i64,
    pub name: Option<String>,
    pub db_type: Option<SupportedDatabases>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub last_accessed_at: Option<NaiveDateTime>,
    pub unique_identifier: Option<Uuid>,
    pub config: Option<serde_json::Value>,
}

impl DetailedDatabaseView {
    pub fn from_model(db: &Database) -> Self {
        Self {
            id: db.id,
            name: db.name.clone(),
            db_type: db.db_type.clone(),
            inserted_at: db.inserted_at,
            updated_at: db.updated_at,
            last_accessed_at: db.last_accessed_at,
            unique_identifier: db.unique_identifier.clone(),
            config: db.config.clone(),
        }
    }
}
