use chrono::Utc;
use common::models::{
    app::App,
    app_column::{AppColumn, AppColumnChangeset, DateTimeFormat, TypeValidation},
    app_table::AppTable,
};
use diesel::{result::Error, Connection, PgConnection, RunQueryDsl};
use serde::Deserialize;

use crate::repository::app_column::AppColumnRepository;

use super::replace_non_alphanumeric_with_underscore;

#[derive(Deserialize)]
pub struct CreatePayload {
    pub name: String,
    pub table_id: i64,
    pub description: Option<String>,
    pub display_order: i32,
    pub is_primary: bool,
    pub type_validation: TypeValidation,
}

pub fn create_default_columns(conn: &mut PgConnection, table: &AppTable) -> Result<(), Error> {
    let columns = vec![
        AppColumnChangeset {
            name: "ID".to_string(),
            description: Some(format!("Primary Key of the table: {}", table.name.clone())),
            table_id: table.id,
            real_name: "id".to_owned(),
            type_validation: common::models::app_column::TypeValidation::AutoNumber {},
            display_order: 1,
            is_primary: true,
            inserted_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
        },
        AppColumnChangeset {
            name: "Status".to_string(),
            description: Some("Status of the record".to_string()),
            table_id: table.id,
            real_name: "status".to_owned(),
            is_primary: false,
            type_validation: common::models::app_column::TypeValidation::SingleSelect {
                options: vec![
                    "Pending".to_string(),
                    "Success".to_string(),
                    "Failed".to_string(),
                ],
                default: Some("Pending".to_string()),
            },
            display_order: 2,
            inserted_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
        },
        AppColumnChangeset {
            name: "Created At".to_string(),
            description: Some("When Record was Created".to_string()),
            table_id: table.id,
            real_name: "created_at".to_owned(),
            type_validation: common::models::app_column::TypeValidation::CreatedAt {
                format: DateTimeFormat::UK,
            },
            is_primary: false,
            display_order: 3,
            inserted_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
        },
        AppColumnChangeset {
            name: "Updated At".to_string(),
            description: Some("When Record was Created".to_string()),
            table_id: table.id,
            real_name: "updated_at".to_owned(),
            type_validation: common::models::app_column::TypeValidation::UpdatedAt {
                format: DateTimeFormat::UK,
            },
            is_primary: false,
            display_order: 4,
            inserted_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
        },
    ];

    for columns in columns {
        AppColumn::create(conn, columns)?;
    }
    Ok(())
}
pub fn create(conn: &mut PgConnection, payload: &CreatePayload) -> Result<AppColumn, String> {
    let real_name = replace_non_alphanumeric_with_underscore(payload.name.clone());
    if real_name.len() > 63 {
        return Err("Table name is too long. Max 63 Characters are allowed.".to_string());
    }

    conn.transaction::<AppColumn, Error, _>(|conn| {
        let cs = AppColumnChangeset {
            name: payload.name.clone(),
            description: payload.description.clone(),
            table_id: payload.table_id,
            real_name: real_name.clone(),
            is_primary: payload.is_primary,
            type_validation: payload.type_validation.clone(),
            display_order: payload.display_order,
            inserted_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
        };
        let column = AppColumn::create(conn, cs)?;
        let table = AppTable::find(conn, payload.table_id)?;
        let app = App::find(conn, table.app_id)?;
        let column_type = payload.type_validation.clone().get_pg_type();
        let table_name_with_schema = format!("{}.{}", app.schema_name, table.real_name.clone());
        let query = format!(
            "ALTER TABLE {} ADD COLUMN {} {};",
            table_name_with_schema, real_name, column_type
        );
        println!("Query: {}", &query);
        diesel::sql_query(query).execute(conn)?;

        Ok(column)
    })
    .map_err(|err| {
        match err
            .to_string()
            .find("duplicate key value violates unique constraint")
        {
            Some(_) => "Column already exists. Choose a different name".to_string(),
            None => err.to_string(),
        }
    })
}

pub fn find_by_table_id(conn: &mut PgConnection, table_id: i64) -> Result<Vec<AppColumn>, Error> {
    AppColumn::find_by_table_id(conn, table_id)
}
