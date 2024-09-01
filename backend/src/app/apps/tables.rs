use chrono::{DateTime, NaiveDate, NaiveDateTime, NaiveTime, Utc};
use common::{
    models::{
        app::App,
        app_column::{AppColumn, AppColumnChangeset, TypeValidation},
        app_table::{AppTable, AppTableChangeset},
        row::{IntOrFloat, RowElement},
    },
    responses::row_response::SingleRowResponse,
};
use deadpool_postgres::Pool;
use diesel::{
    pg::{Pg, PgValue},
    result::Error,
    Connection, PgConnection, RunQueryDsl,
};
use rust_decimal::{prelude::ToPrimitive, Decimal};
use serde::{Deserialize, Serialize};
use tokio_postgres::Row;
use uuid::Uuid;

use std::error::Error as StdError;

use crate::{
    app::results::adapters::postgres::PostgresAdapter, errors::AGError,
    repository::app_table::AppTableRepository,
};

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

pub async fn create_empty_row(
    conn: &mut PgConnection,
    raw_pool: &Pool,
    primary_key_value: Option<RowElement>,
    table_id: i64,
    current_user_id: i64,
) -> Result<SingleRowResponse, Box<dyn StdError>> {
    let table = AppTable::find(conn, table_id)
        .map_err(|_err| Box::new(AGError::new("Table doesn't Exist")) as Box<dyn StdError>)?;
    let schema_name = App::find(conn, table.app_id)
        .map_err(|_err| Box::new(AGError::new("App doesn't Exist")) as Box<dyn StdError>)?
        .schema_name;
    let columns = AppColumn::find_by_table_id(conn, table_id).map_err(|_err| {
        Box::new(AGError::new("Couldn't find table columns")) as Box<dyn StdError>
    })?;
    // create sql query to insert into table with default values, sort columns by display_order
    // then primary key.
    let mut query = format!(
        "INSERT INTO {}.{} (",
        schema_name.clone(),
        table.real_name.clone()
    );
    let mut values = String::from("VALUES (");
    for (i, column) in columns.iter().enumerate() {
        if let TypeValidation::AutoNumber {} = column.type_validation {
            continue;
        }
        if column.is_primary {
            query.push_str(&column.real_name);

            values.push_str(
                primary_key_value
                    .clone()
                    .unwrap_or_default()
                    .to_sql_value()
                    .as_str(),
            );
            continue;
        }
        query.push_str(&column.real_name);
        values.push_str(
            column
                .default_value(current_user_id)
                .to_sql_value()
                .as_str(),
        );
        if i < columns.len() - 1 {
            query.push_str(", ");
            values.push_str(", ");
        }
    }

    query.push_str(") ");
    values.push_str(") RETURNING *");
    query.push_str(&values);

    let pool_conn = raw_pool.get().await.map_err(|err| err.to_string())?;
    let res = pool_conn
        .query(query.clone().as_str(), &[])
        .await
        .map_err(|err| err.to_string())?;

    if res.is_empty() {
        return Ok(SingleRowResponse::default());
    }

    let columns = res[0]
        .columns()
        .iter()
        .map(|col| col.name().to_string())
        .collect::<Vec<String>>();

    let rows = to_row_element(&res[0]);

    Ok(SingleRowResponse { row: rows, columns })
}

fn to_row_element(row: &Row) -> Vec<RowElement> {
    let mut r = Vec::new();
    for (i, column) in row.columns().iter().enumerate() {
        let element = match column.type_().name() {
            "bool" => row
                .try_get(i)
                .unwrap_or(None)
                .map_or(RowElement::None, RowElement::Boolean),
            "int2" => row
                .try_get(i)
                .unwrap_or(None)
                .map_or(RowElement::None, |x: i16| {
                    RowElement::Number(IntOrFloat::Int(x as i64))
                }),
            "_int2" => row
                .try_get(i)
                .unwrap_or(None)
                .map_or(RowElement::None, |v: Vec<i16>| {
                    RowElement::ArrayNumber(
                        v.into_iter().map(|x| IntOrFloat::Int(x as i64)).collect(),
                    )
                }),
            "int4" => row
                .try_get(i)
                .unwrap_or(None)
                .map_or(RowElement::None, |x: i32| {
                    RowElement::Number(IntOrFloat::Int(x as i64))
                }),
            "_int4" => row
                .try_get(i)
                .unwrap_or(None)
                .map_or(RowElement::None, |v: Vec<i32>| {
                    RowElement::ArrayNumber(
                        v.into_iter().map(|x| IntOrFloat::Int(x as i64)).collect(),
                    )
                }),
            "int8" => row
                .try_get(i)
                .unwrap_or(None)
                .map_or(RowElement::None, |x: i64| {
                    RowElement::Number(IntOrFloat::Int(x as i64))
                }),
            "_int8" => row
                .try_get(i)
                .unwrap_or(None)
                .map_or(RowElement::None, |v: Vec<i64>| {
                    RowElement::ArrayNumber(
                        v.into_iter().map(|x| IntOrFloat::Int(x as i64)).collect(),
                    )
                }),
            "float4" => row
                .try_get(i)
                .unwrap_or(None)
                .map_or(RowElement::None, |x: f32| {
                    RowElement::Number(IntOrFloat::Float(x as f64))
                }),
            "_float4" => row
                .try_get(i)
                .unwrap_or(None)
                .map_or(RowElement::None, |v: Vec<f32>| {
                    RowElement::ArrayNumber(
                        v.into_iter().map(|x| IntOrFloat::Float(x as f64)).collect(),
                    )
                }),
            "float8" => row
                .try_get(i)
                .unwrap_or(None)
                .map_or(RowElement::None, |x: f64| {
                    RowElement::Number(IntOrFloat::Float(x as f64))
                }),
            "_float8" => row
                .try_get(i)
                .unwrap_or(None)
                .map_or(RowElement::None, |v: Vec<f64>| {
                    RowElement::ArrayNumber(
                        v.into_iter().map(|x| IntOrFloat::Float(x as f64)).collect(),
                    )
                }),
            "text" | "varchar" | "name" | "char" | "bpchar" => row
                .try_get(i)
                .unwrap_or(None)
                .map_or(RowElement::None, RowElement::Text),
            "_text" | "_varchar" | "_name" | "_char" | "_bpchar" => row
                .try_get(i)
                .unwrap_or(None)
                .map_or(RowElement::None, RowElement::ArrayString),
            "numeric" => row
                .try_get(i)
                .unwrap_or(None)
                .map_or(RowElement::None, |x: Decimal| {
                    RowElement::Number(IntOrFloat::Float(x.to_f64().unwrap_or_default()))
                }),
            "_numeric" => {
                row.try_get(i)
                    .unwrap_or(None)
                    .map_or(RowElement::None, |v: Vec<Decimal>| {
                        RowElement::ArrayNumber(
                            v.into_iter()
                                .map(|x| IntOrFloat::Float(x.to_f64().unwrap_or_default()))
                                .collect(),
                        )
                    })
            }
            "date" => row
                .try_get(i)
                .unwrap_or(None)
                .map_or(RowElement::None, RowElement::Date),
            "time" => row
                .try_get(i)
                .unwrap_or(None)
                .map_or(RowElement::None, RowElement::Time),
            "timestamp" => row
                .try_get(i)
                .unwrap_or(None)
                .map_or(RowElement::None, RowElement::DateTime),
            "timestamptz" => row
                .try_get(i)
                .unwrap_or(None)
                .map_or(RowElement::None, |x: DateTime<Utc>| {
                    RowElement::DateTime(x.naive_utc())
                }),
            "uuid" => row
                .try_get(i)
                .unwrap_or(None)
                .map_or(RowElement::None, |x: Uuid| RowElement::Text(x.to_string())),
            "_uuid" => row
                .try_get(i)
                .unwrap_or(None)
                .map_or(RowElement::None, |v: Vec<Uuid>| {
                    RowElement::ArrayString(v.into_iter().map(|x| x.to_string()).collect())
                }),
            _ => RowElement::None,
        };
        r.push(element);
    }
    r
}
