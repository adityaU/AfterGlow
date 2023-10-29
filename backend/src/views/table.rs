use chrono::NaiveDateTime;
use diesel::PgConnection;
use serde::{Deserialize, Serialize};

use crate::repository::models::{Column, ColumnView, Table};

#[derive(Debug, Serialize, Deserialize)]
pub struct DetailedTableView {
    pub id: i32,
    pub name: Option<String>,
    pub database_id: Option<i32>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub readable_table_name: Option<String>,
    pub description: Option<String>,
    pub columns: Vec<ColumnView>,
}

impl DetailedTableView {
    pub fn from_model(conn: &mut PgConnection, table: &Table) -> Self {
        let columns = Column::find_by_table_id(conn, table.id).unwrap_or(vec![]);
        let column_views = columns
            .iter()
            .map(|column| ColumnView::from_model(column))
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
