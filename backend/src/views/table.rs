use chrono::NaiveDateTime;
use diesel::PgConnection;
use serde::{Deserialize, Serialize};

use crate::repository::models::{Column, ColumnView, Table};

#[derive(Debug, Serialize, Deserialize)]
pub struct Unimplemented;

#[derive(Debug, Serialize, Deserialize)]
pub struct DetailedTableView {
    pub id: i64,
    pub name: Option<String>,
    pub database_id: Option<i64>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub readable_table_name: Option<String>,
    pub description: Option<String>,
    pub columns: Vec<StrippedColumnView>,
}

impl DetailedTableView {
    pub fn from_model(conn: &mut PgConnection, table: &Table) -> Self {
        let columns = Column::find_by_table_id(conn, table.id).unwrap_or(vec![]);
        let column_views = columns
            .iter()
            .map(|column| StrippedColumnView::from_model(column))
            .collect();
        Self {
            id: table.id,
            name: table.name.clone(),
            database_id: table.database_id,
            inserted_at: table.inserted_at,
            updated_at: table.updated_at,
            readable_table_name: table.readable_table_name.clone(),
            description: table.description.clone(),
            columns: column_views,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StrippedColumnView {
    pub id: i64,
    pub name: Option<String>,
    pub table_id: Option<i64>,
    pub data_type: Option<String>,
    pub description: Option<String>,
    pub primary_key: Option<bool>,
    pub belongs_to: Vec<Unimplemented>,
}

impl StrippedColumnView {
    pub fn from_model(column: &Column) -> Self {
        Self {
            id: column.id,
            name: column.name.clone(),
            table_id: column.table_id,
            data_type: column.data_type.clone(),
            description: column.description.clone(),
            primary_key: column.primary_key,
            belongs_to: vec![],
        }
    }
}
