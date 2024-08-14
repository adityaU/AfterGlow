use chrono::NaiveDateTime;
use chrono::Utc;
use crud_derive::{Changeset, View};
use diesel::deserialize::Queryable;
use diesel::result::Error;
use diesel::AsChangeset;
use diesel::Insertable;
use diesel::PgConnection;
use diesel::QueryDsl;
use diesel::RunQueryDsl;

use super::schema::app_tables;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Debug, Serialize, Deserialize, Changeset, View)]
pub struct AppTable {
    #[skip_in_changeset]
    pub id: i64,
    pub name: String,
    pub real_name: String,
    pub description: Option<String>,
    pub app_id: i32,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}
