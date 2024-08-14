pub mod colors;
pub mod columns;
pub mod tables;

use crate::{diesel::RunQueryDsl, errors::AGError};
use chrono::Utc;
use common::models::app::{App, AppChangeset};
use diesel::{result::Error, Connection, PgConnection};
use rand::{seq::SliceRandom, thread_rng};

use crate::controllers::apps::CreatePayload;

use self::colors::DEFAULT_COLORS;

use super::results::QueryError;

pub fn find(conn: &mut PgConnection, app_id: i32) -> Result<App, Error> {
    App::find(conn, app_id)
}

pub fn create(conn: &mut PgConnection, data: CreatePayload) -> Result<App, String> {
    let schema_name = replace_non_alphanumeric_with_underscore(data.name.clone());
    if schema_name.len() > 63 {
        return Err("App name is too long. Max 63 Characters are allowed.".to_string());
    }
    conn.transaction::<App, Error, _>(|conn| {
        // Create the schema
        diesel::sql_query(format!("CREATE SCHEMA {}", schema_name)).execute(conn)?;
        let mut rng = thread_rng();
        let color = DEFAULT_COLORS
            .other_colors
            .choose(&mut rng)
            .unwrap_or(&DEFAULT_COLORS.theme_colors[0]);

        let changeset = AppChangeset {
            name: data.name.clone(),
            schema_name: schema_name.clone(),
            description: data.description.clone(),
            inserted_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
            color: color.to_string(),
        };

        App::create(conn, changeset)
    })
    .map_err(|err| {
        match err
            .to_string()
            .find("duplicate key value violates unique constraint")
        {
            Some(_) => "App already exists. Choose a different name".to_string(),
            None => err.to_string(),
        }
    })
}

pub fn replace_non_alphanumeric_with_underscore(input: String) -> String {
    input
        .chars()
        .map(|c| if c.is_alphanumeric() { c } else { '_' })
        .collect::<String>()
        .to_lowercase()
}

pub fn index(conn: &mut PgConnection) -> Result<Vec<App>, Error> {
    App::index(conn)
}
