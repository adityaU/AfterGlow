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

use super::schema::apps;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Debug, Serialize, Deserialize, Changeset, View)]
#[id_data_type = "i32"]
pub struct App {
    #[skip_in_changeset]
    pub id: i32,
    pub name: String,
    pub schema_name: String,
    pub color: String,
    pub description: Option<String>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}
