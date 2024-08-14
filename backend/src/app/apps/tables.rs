use chrono::Utc;
use common::models::{
    app::App,
    app_column::AppColumnChangeset,
    app_table::{AppTable, AppTableChangeset},
};
use diesel::{result::Error, Connection, PgConnection, RunQueryDsl};
use serde::Deserialize;

use crate::repository::app_table::AppTableRepository;

use super::{columns::create_default_columns, replace_non_alphanumeric_with_underscore};

#[derive(Deserialize)]
pub struct CreatePayload {
    pub name: String,
    pub app_id: i32,
    pub description: Option<String>,
}

pub fn find_by_app_id(conn: &mut PgConnection, app_id: i32) -> Result<Vec<AppTable>, Error> {
    AppTable::find_by_app_id(conn, app_id)
}

pub fn create(conn: &mut PgConnection, data: CreatePayload) -> Result<AppTable, String> {
    let real_name = replace_non_alphanumeric_with_underscore(data.name.clone());
    if real_name.len() > 63 {
        return Err("Table name is too long. Max 63 Characters are allowed.".to_string());
    }
    conn.transaction::<AppTable, Error, _>(|conn| {
        // Create the schema

        let changeset = AppTableChangeset {
            name: data.name.clone(),
            description: data.description.clone(),
            inserted_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
            real_name: real_name.clone(),
            app_id: data.app_id,
        };

        let schema_name = App::find(conn, data.app_id)?.schema_name;

        let table = AppTable::create(conn, changeset)?;
        create_default_columns(conn, &table)?;
        let table_name_with_schema = format!("{}.{}", schema_name, real_name);
        let result = diesel::sql_query(format!("CREATE TABLE {} ()", table_name_with_schema))
            .execute(conn)?;
        println!("{:?}", result);

        diesel::sql_query(format!(
            "ALTER TABLE {} ADD COLUMN id SERIAL PRIMARY KEY;",
            table_name_with_schema
        ))
        .execute(conn)?;

        diesel::sql_query(format!(
            "ALTER TABLE {} ADD COLUMN status VARCHAR(255) NOT NULL;",
            table_name_with_schema
        ))
        .execute(conn)?;

        diesel::sql_query(format!(
            "ALTER TABLE {} ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;",
            table_name_with_schema
        ))
        .execute(conn)?;

        diesel::sql_query(format!(
            "ALTER TABLE {} ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;",
            table_name_with_schema
        ))
        .execute(conn)?;

        println!("{:?}", result);
        Ok(table)
    })
    .map_err(|err| {
        match err
            .to_string()
            .find("duplicate key value violates unique constraint")
        {
            Some(_) => "Table already exists. Choose a different name".to_string(),
            None => err.to_string(),
        }
    })
}
