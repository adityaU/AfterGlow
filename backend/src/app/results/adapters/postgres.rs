use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
    time::Duration,
};

use chrono::{DateTime, NaiveDate, NaiveDateTime, NaiveTime, Utc};
use deadpool_postgres::{Manager, ManagerConfig, Pool, RecyclingMethod};
use diesel::PgConnection;

use rust_decimal::Decimal;
use serde_json::{from_value, Value};
use tokio::time::timeout;
use tokio_postgres::{NoTls, Row};
use uuid::Uuid;

use super::{
    super::query_builders::QueryBuilder, DBAdapter, DBAdapterResponse, DBColumn, DBTable,
    ForeignKey, PrimaryKey,
};

use crate::app::{
    databases::DBConfig,
    results::{
        helpers::hashed_db_credentials,
        payload_adapter::AdaptedPayload,
        query_builders::postgres::{DBValue, Postgres},
        ColumnDetail, ConnectionPools, DataType, QueryError,
    },
};

pub struct PostgresAdapter {
    pub db_config: DBConfig,
}

#[async_trait::async_trait]
impl DBAdapter for PostgresAdapter {
    async fn fetch_response(
        conn: &mut PgConnection,
        db_config: DBConfig,
        cps: &Arc<Mutex<ConnectionPools>>,
        adapted_payload: AdaptedPayload,
        user_id: i32,
        org_id: i64,
    ) -> Result<DBAdapterResponse, QueryError> {
        let adapter = Self { db_config };
        let query = Postgres::new(adapted_payload)
            .build(conn, user_id, org_id)
            .map_err(|err| QueryError::new(err, "".to_string()))?;
        let pool = Self::get_pool(&adapter, cps)?;
        let (rows, columns, column_details) = Self::fetch(
            pool,
            query.final_query.clone(),
            adapter.db_config.query_timeout.unwrap_or(60u64),
        )
        .await?;

        Ok(DBAdapterResponse {
            columns: columns.into(),
            rows: rows.into(),
            column_details: column_details.into(),
            final_query: query.final_query.clone().into(),
            adapted_query: query.adapted_query.into(),
        })
    }

    async fn get_primary_keys(
        cps: &Arc<Mutex<ConnectionPools>>,
        db_config: DBConfig,
    ) -> Result<Vec<PrimaryKey>, QueryError> {
        let query = r#"SELECT
            pg_attribute.attname as column_name, concat('"', nspname, '"."',  pg_class.relname, '"') as table_name
          FROM pg_index, pg_class, pg_attribute, pg_namespace
          WHERE
            indrelid = pg_class.oid AND
            nspname = 'public' AND
            pg_class.relnamespace = pg_namespace.oid AND
            pg_attribute.attrelid = pg_class.oid AND
            pg_attribute.attnum = any(pg_index.indkey)
           AND indisprimary"#;

        let adapter = Self { db_config };
        let pool = Self::get_pool(&adapter, cps)?;
        let rows = Self::fetch_raw(pool, query.to_string()).await?;

        let mut res: Vec<PrimaryKey> = vec![];
        for row in &rows {
            let column_name: String = row
                .try_get("column_name")
                .map_err(|err| QueryError::new(err.to_string(), query.to_string()))?;
            let table_name: String = row
                .try_get("table_name")
                .map_err(|err| QueryError::new(err.to_string(), query.to_string()))?;
            res.push(PrimaryKey {
                column_name,
                table_name,
            })
        }

        Ok(res)
    }

    async fn get_fkeys(
        cps: &Arc<Mutex<ConnectionPools>>,
        db_config: DBConfig,
    ) -> Result<Vec<ForeignKey>, QueryError> {
        let query = r#"SELECT conname as name
            ,concat('"', n.nspname, '"."', conrelid::regclass::text, '"') AS "table_name"
            ,CASE WHEN pg_get_constraintdef(c.oid) LIKE 'FOREIGN KEY %' THEN substring(pg_get_constraintdef(c.oid), 14, position(')' in pg_get_constraintdef(c.oid))-14) END AS "column_name"
            ,concat('"', n.nspname, '"."', CASE WHEN pg_get_constraintdef(c.oid) LIKE 'FOREIGN KEY %' THEN substring(pg_get_constraintdef(c.oid), position(' REFERENCES ' in pg_get_constraintdef(c.oid))+12, position('(' in substring(pg_get_constraintdef(c.oid), 14))-position(' REFERENCES ' in pg_get_constraintdef(c.oid))+1) END, '"') AS "foreign_table_name"
            ,CASE WHEN pg_get_constraintdef(c.oid) LIKE 'FOREIGN KEY %' THEN substring(pg_get_constraintdef(c.oid), position('(' in substring(pg_get_constraintdef(c.oid), 14))+14, position(')' in substring(pg_get_constraintdef(c.oid), position('(' in substring(pg_get_constraintdef(c.oid), 14))+14))-1) END AS "foreign_column_name"
        FROM   pg_constraint c
        JOIN   pg_namespace n ON n.oid = c.connamespace
        WHERE  contype IN ('f')
        AND pg_get_constraintdef(c.oid) LIKE 'FOREIGN KEY %'
        ORDER  BY pg_get_constraintdef(c.oid), conrelid::regclass::text, contype DESC"#;

        let adapter = Self { db_config };
        let pool = Self::get_pool(&adapter, cps)?;
        let rows = Self::fetch_raw(pool, query.to_string()).await?;

        let mut res: Vec<ForeignKey> = vec![];
        for row in &rows {
            let column_name: String = row
                .try_get("column_name")
                .map_err(|err| QueryError::new(err.to_string(), query.to_string()))?;
            let table_name: String = row
                .try_get("table_name")
                .map_err(|err| QueryError::new(err.to_string(), query.to_string()))?;
            let foreign_table_name: String = row
                .try_get("foreign_table_name")
                .map_err(|err| QueryError::new(err.to_string(), query.to_string()))?;
            let foreign_column_name: String = row
                .try_get("foreign_column_name")
                .map_err(|err| QueryError::new(err.to_string(), query.to_string()))?;
            let relation_name: String = row
                .try_get("name")
                .map_err(|err| QueryError::new(err.to_string(), query.to_string()))?;
            res.push(ForeignKey {
                column_name,
                table_name,
                foreign_table_name,
                foreign_column_name,
                relation_name,
            })
        }

        Ok(res)
    }
    async fn get_schema(
        cps: &Arc<Mutex<ConnectionPools>>,
        db_config: DBConfig,
    ) -> Result<Vec<DBTable>, QueryError> {
        let query = r#"select
      table_catalog,
      CONCAT('"', table_schema,'"."', table_name, '"') as table_name,
      table_name as readable_table_name,
      table_schema,
      json_agg((select x from (select cast(column_name as text) as "name", cast(data_type as text) as "data_type") x)) as columns
      from information_schema.columns

      where information_schema.columns.table_schema not in ('information_schema', 'pg_catalog')
        group by table_catalog,table_schema, table_name"#;
        let adapter = Self { db_config };
        let pool = Self::get_pool(&adapter, cps)?;
        let rows = Self::fetch_raw(pool, query.to_string()).await?;

        let mut res: Vec<DBTable> = vec![];
        for row in &rows {
            let columns: Value = row
                .try_get("columns")
                .map_err(|err| QueryError::new(err.to_string(), query.to_string()))?;
            let columns: Vec<DBColumn> = from_value(columns)
                .map_err(|err| QueryError::new(err.to_string(), query.to_string()))?;
            let table_name: String = row
                .try_get("table_name")
                .map_err(|err| QueryError::new(err.to_string(), query.to_string()))?;
            let readable_table_name: String = row
                .try_get("readable_table_name")
                .map_err(|err| QueryError::new(err.to_string(), query.to_string()))?;
            res.push(DBTable {
                columns,
                table_name,
                readable_table_name,
            })
        }

        Ok(res)
    }
}

impl PostgresAdapter {
    async fn fetch(
        pool: Arc<Pool>,
        query: String,
        timeout_duration: u64,
    ) -> Result<
        (
            Vec<Vec<DBValue>>,
            Vec<String>,
            HashMap<String, ColumnDetail>,
        ),
        QueryError,
    > {
        let duration = Duration::from_secs(timeout_duration);
        let (str_rows, columns, column_details) = {
            timeout(duration, async {
                let res = match Self::fetch_raw(pool, query.clone()).await {
                    Ok(value) => value,
                    Err(err) => return Err(err),
                };

                Ok(Self::convert_rows(&res))
            })
        }
        .await
        .map_err(|err| QueryError::new(err.to_string(), query.clone()))?
        .map_err(|err| QueryError::new(err.to_string(), query.clone()))?;
        Ok((str_rows, columns, column_details))
    }

    async fn fetch_raw(pool: Arc<Pool>, query: String) -> Result<Vec<Row>, QueryError> {
        let pool_conn = match pool
            .get()
            .await
            .map_err(|err| QueryError::new(err.to_string(), query.clone()))
        {
            Ok(value) => value,
            Err(err) => return Err(err),
        };
        let res = match pool_conn
            .query(query.clone().as_str(), &[])
            .await
            .map_err(|err| QueryError::new(err.to_string(), query.clone()))
        {
            Ok(value) => value,
            Err(err) => return Err(err),
        };

        Ok(res)
    }

    fn convert_rows(
        row_results: &Vec<Row>,
    ) -> (
        Vec<Vec<DBValue>>,
        Vec<String>,
        HashMap<String, ColumnDetail>,
    ) {
        let mut str_rows = vec![];
        if row_results.is_empty() {
            return (vec![], vec![], HashMap::new());
        }
        let columns = row_results[0]
            .columns()
            .iter()
            .map(|col| col.name().to_string())
            .collect::<Vec<String>>();
        for row in row_results {
            let str_row = Self::row_to_json(row);
            str_rows.push(str_row)
        }

        let column_details = Self::get_column_details(&row_results[0]);
        (str_rows, columns, column_details)
    }

    fn create_pool(&self) -> Result<Pool, String> {
        let mut pg_config = tokio_postgres::Config::new();
        pg_config.user(self.db_config.username.as_str());

        if let Some(password) = &self.db_config.password {
            pg_config.password(password.as_str());
        }
        pg_config.host(self.db_config.host_url.as_str());
        pg_config.port(self.db_config.host_port);
        pg_config.dbname(self.db_config.db_name.as_str());
        pg_config.connect_timeout(Duration::from_secs(
            self.db_config.checkout_timeout.unwrap_or(45),
        ));
        let mgr_config = ManagerConfig {
            recycling_method: RecyclingMethod::Fast,
        };
        let mgr = Manager::from_config(pg_config, NoTls, mgr_config);
        Pool::builder(mgr)
            .max_size(self.db_config.pool_size.unwrap_or(10) as usize)
            .build()
            .map_err(|err| err.to_string())
    }

    fn get_pool(&self, cps: &Arc<Mutex<ConnectionPools>>) -> Result<Arc<Pool>, QueryError> {
        let mut connection_pools = cps.lock().unwrap();
        let key = hashed_db_credentials(&self.db_config);
        let pool = match connection_pools.postgres.get(&key) {
            Some(p) => Arc::clone(p),
            None => {
                let p = Self::create_pool(self)
                    .map_err(|err| QueryError::new(err.to_string(), "".to_string()))?;
                let rc = Arc::new(p);
                connection_pools.postgres.insert(key, Arc::clone(&rc));
                Arc::clone(&rc)
            }
        };
        Ok(pool)
    }
    fn get_column_details(row: &Row) -> HashMap<String, ColumnDetail> {
        let mut column_details = HashMap::new();

        for column in row.columns().iter() {
            let (is_array, data_type) = match column.type_().name() {
                "bool" => (false, DataType::Bool),
                "_bool" => (true, DataType::Bool),
                "int2" | "int4" | "int8" | "float8" | "float4" | "numeric" => {
                    (false, DataType::Number)
                }
                "_int2" | "_int4" | "_int8" | "_float8" | "_float4" | "_numeric" => {
                    (true, DataType::Number)
                }
                "text" | "varchar" | "name" | "char" | "uuid" => (false, DataType::String),
                "_text" | "_varchar" | "_name" | "_char" | "_uuid" => (true, DataType::String),
                "date" | "time" | "timestamp" | "timestamptz" => (false, DataType::DateTime),
                "_date" | "_time" | "_timestamp" | "_timestamptz" => (true, DataType::DateTime),
                "json" | "jsonb" => (false, DataType::Json),
                "_json" | "_jsonb" => (true, DataType::Json),
                _ => (false, DataType::String),
            };
            let column_detail = ColumnDetail::new(data_type, is_array);
            column_details.insert(column.name().to_string(), column_detail);
        }

        column_details
    }

    fn row_to_json(row: &Row) -> Vec<DBValue> {
        let mut r: Vec<DBValue> = vec![];

        for (i, column) in row.columns().iter().enumerate() {
            match column.type_().name() {
                "bool" => {
                    let value: Option<bool> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::Bool(value));
                }
                "_bool" => {
                    let value: Option<Vec<bool>> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::VecBool(value));
                }
                "int2" => {
                    let value: Option<i16> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::Int16(value));
                }
                "_int2" => {
                    let value: Option<Vec<i16>> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::VecInt16(value));
                }
                "int4" => {
                    let value: Option<i32> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::Int32(value));
                }
                "_int4" => {
                    let value: Option<Vec<i32>> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::VecInt32(value));
                }
                "int8" => {
                    let value: Option<i64> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::Int64(value));
                }
                "_int8" => {
                    let value: Option<Vec<i64>> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::VecInt64(value));
                }
                "float4" => {
                    let value: Option<f32> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::Float32(value));
                }
                "_float4" => {
                    let value: Option<Vec<f32>> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::VecFloat32(value));
                }
                "float8" => {
                    let value: Option<f64> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::Float64(value));
                }
                "_float8" => {
                    let value: Option<Vec<f64>> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::VecFloat64(value));
                }
                "text" | "varchar" | "name" | "char" | "bytea" | "bpchar" => {
                    let value: Option<String> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::Strings(value));
                }
                "_text" | "_varchar" | "_name" | "_char" | "_bpchar" => {
                    let value: Option<Vec<String>> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::VecString(value));
                }
                "numeric" => {
                    let value: Option<Decimal> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::Decimal(value));
                }
                "_numeric" => {
                    let value: Option<Vec<Decimal>> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::VecDecimal(value));
                }
                "bytea" => {
                    let value: Option<Vec<u8>> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::Strings(
                        String::from_utf8(value.unwrap_or_default()).ok(),
                    ));
                }
                "date" => {
                    let value: Option<NaiveDate> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::Date(value));
                }
                "time" => {
                    let value: Option<NaiveTime> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::Time(value));
                }
                "timestamp" => {
                    let value: Option<NaiveDateTime> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::DateTime(value));
                }
                "timestamptz" => {
                    let value: Option<DateTime<Utc>> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::UtcDateTime(value));
                }
                "_date" => {
                    let value: Option<Vec<NaiveDate>> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::VecDate(value));
                }
                "_time" => {
                    let value: Option<Vec<NaiveTime>> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::VecTime(value));
                }
                "_timestamp" => {
                    let value: Option<Vec<NaiveDateTime>> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::VecDateTime(value));
                }
                "_timestamptz" => {
                    let value: Option<Vec<DateTime<Utc>>> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::VecUtcDateTime(value));
                }
                "uuid" => {
                    let value: Option<Uuid> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::Uuid(value));
                }
                "_uuid" => {
                    let value: Option<Vec<Uuid>> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::VecUUID(value));
                }
                "json" | "jsonb" => {
                    let value: Option<Value> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::Json(value));
                }
                "_json" | "_jsonb" => {
                    let value: Option<Vec<Value>> = row.try_get(i).unwrap_or(None);
                    r.push(DBValue::VecJSON(value));
                }
                _ => {
                    println!("Unsupported type: {}", column.type_().name());
                    let value = Some(String::from("unsupported type"));
                    r.push(DBValue::Strings(value));
                }
            }
        }

        r
    }
}
