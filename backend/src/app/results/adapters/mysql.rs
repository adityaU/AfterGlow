use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
    time::Duration,
};

use chrono::{DateTime, NaiveDate, NaiveDateTime, NaiveTime, Utc};
use diesel::PgConnection;

use mysql_async::{
    prelude::{FromValue, Queryable},
    Params, Pool, Row, TxOpts,
};
use rsa::rand_core::le;
use rust_decimal::Decimal;
use serde_json::{from_value, Value};
use tokio::time::timeout;
use uuid::Uuid;

use super::{
    super::query_builders::QueryBuilder, DBAdapter, DBAdapterResponse, DBColumn, DBTable,
    ForeignKey, PrimaryKey, RolePayload,
};

use crate::app::{
    databases::DBConfig,
    results::{
        adapters::DBValue,
        helpers::hashed_db_credentials,
        payload_adapter::AdaptedPayload,
        query_builders::{mysql::Mysql, postgres::Postgres, sql_base::SQlBased as _, Queries},
        ColumnDetail, ConnectionPools, DataType, QueryError,
    },
};

pub struct MysqlAdapter {
    pub db_config: DBConfig,
}

#[async_trait::async_trait]
impl DBAdapter for MysqlAdapter {
    async fn update_role(
        &self,
        payload: RolePayload,
        cps: &Arc<Mutex<ConnectionPools>>,
    ) -> Result<(), QueryError> {
        let mut queries = vec![];
        let query = format!(
            "REVOKE ALL ON DATABASE {} FROM {};",
            self.db_config.db_name, payload.role_name
        );
        queries.push(query);
        for table in payload.permitted_tables.iter() {
            let table_name = &table.name;
            if table.columns.is_empty() {
                let query = format!(
                    "GRANT SELECT ON TABLE {} TO {};",
                    table_name, payload.role_name
                );
                queries.push(query);
            } else {
                let query = format!(
                    "GRANT SELECT({})  ON TABLE {} TO {};",
                    table.columns.join(", "),
                    table_name,
                    payload.role_name
                );
                queries.push(query);
            }
        }

        let pool = self.get_pool(cps)?;
        Self::execute_in_transaction(pool, queries).await?;

        Ok(())
    }
    async fn create_role(
        &self,
        payload: RolePayload,
        cps: &Arc<Mutex<ConnectionPools>>,
    ) -> Result<(), QueryError> {
        let mut queries = vec![];
        let query = format!(
            "CREATE ROLE {} WITH LOGIN PASSWORD '{}';",
            payload.role_name, payload.password
        );
        queries.push(query);
        for table in payload.permitted_tables.iter() {
            let table_name = &table.name;
            if table.columns.is_empty() {
                let query = format!(
                    "GRANT SELECT ON TABLE {} TO {};",
                    table_name, payload.role_name
                );
                queries.push(query);
            } else {
                let query = format!(
                    "GRANT SELECT({})  ON TABLE {} TO {};",
                    table.columns.join(", "),
                    table_name,
                    payload.role_name
                );
                queries.push(query);
            }
        }

        let pool = self.get_pool(cps)?;
        Self::execute_in_transaction(pool, queries).await?;

        Ok(())
    }
    async fn fetch_query_only(
        &self,
        conn: &mut PgConnection,
        adapted_payload: AdaptedPayload,
        user_id: i64,
        org_id: i64,
    ) -> Result<Queries, QueryError> {
        Mysql::new(adapted_payload)
            .build(conn, user_id, org_id)
            .await
            .map_err(|err| QueryError::new(err, "".to_string()))
    }
    async fn fetch_response(
        &self,
        conn: &mut PgConnection,
        cps: &Arc<Mutex<ConnectionPools>>,
        adapted_payload: AdaptedPayload,
        user_id: i64,
        org_id: i64,
    ) -> Result<DBAdapterResponse, QueryError> {
        let query = Mysql::new(adapted_payload)
            .build(conn, user_id, org_id)
            .await
            .map_err(|err| QueryError::new(err, "".to_string()))?;
        let pool = self.get_pool(cps)?;
        let (rows, columns, column_details) = Self::fetch(
            pool,
            query.db_query.clone(),
            query.debug_query.clone(),
            self.db_config.query_timeout.unwrap_or(60u64),
        )
        .await?;

        Ok(DBAdapterResponse {
            columns: columns.into(),
            rows: rows.into(),
            column_details: column_details.into(),
            final_query: query.debug_query.clone().into(),
            adapted_query: query.adapted_query.into(),
        })
    }

    async fn get_primary_keys(
        &self,
        cps: &Arc<Mutex<ConnectionPools>>,
    ) -> Result<Vec<PrimaryKey>, QueryError> {
        let query = r#"SELECT
   table_name,
   column_name
FROM
   information_schema.columns
WHERE
   column_key = 'PRI'

   and table_schema = DATABASE()"#;

        let pool = self.get_pool(cps)?;
        let rows = Self::fetch_raw(pool, query.to_string(), query.to_string()).await?;

        let mut res: Vec<PrimaryKey> = vec![];
        for row in &rows {
            let data = Self::row_to_json(row);
            let table_name = data[0].to_string();
            let column_name = data[1].to_string();

            res.push(PrimaryKey {
                column_name,
                table_name,
            })
        }

        Ok(res)
    }

    async fn get_fkeys(
        &self,
        cps: &Arc<Mutex<ConnectionPools>>,
    ) -> Result<Vec<ForeignKey>, QueryError> {
        let query = r#"SELECT
    TABLE_NAME as 'table_name',
    COLUMN_NAME as 'column_name',
    CONSTRAINT_NAME as 'name',
    REFERENCED_TABLE_NAME as 'foreign_table_name',REFERENCED_COLUMN_NAME as 'foreign_column_name'
  FROM
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
  WHERE
  REFERENCED_TABLE_SCHEMA = DATABASE()"#;

        let pool = self.get_pool(cps)?;
        let rows = Self::fetch_raw(pool, query.to_string(), query.to_string()).await?;

        let mut res: Vec<ForeignKey> = vec![];
        for row in &rows {
            let data = Self::row_to_json(row);
            let table_name = data[0].to_string();
            let column_name = data[1].to_string();
            let relation_name = data[2].to_string();
            let foreign_table_name = data[3].to_string();
            let foreign_column_name = data[4].to_string();

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
        &self,
        cps: &Arc<Mutex<ConnectionPools>>,
    ) -> Result<Vec<DBTable>, QueryError> {
        let query = r#"
            SELECT table_name, column_name as name, column_type as data_type
            FROM information_schema.columns
            WHERE table_schema = DATABASE()
            ORDER BY table_name, ordinal_position
        "#;

        let pool = self.get_pool(cps)?;
        let rows = Self::fetch_raw(pool, query.to_string(), query.to_string()).await?;

        let mut res: Vec<DBTable> = vec![];
        let mut current_table_name = String::new();
        let mut current_columns: Vec<DBColumn> = vec![];

        for row in &rows {
            let data = Self::row_to_json(row);
            let table_name = data[0].to_string();
            let column_name = data[1].to_string();
            let data_type = data[2].to_string();

            if table_name != current_table_name && !current_table_name.is_empty() {
                res.push(DBTable {
                    table_name: current_table_name.clone(),
                    columns: current_columns.clone(),
                    readable_table_name: current_table_name.clone(), // Modify as needed
                });
                current_columns.clear();
            }

            current_columns.push(DBColumn {
                name: column_name,
                data_type,
            });
            current_table_name = table_name;
        }

        // Push the last table
        if !current_table_name.is_empty() {
            res.push(DBTable {
                table_name: current_table_name.clone(),
                columns: current_columns,
                readable_table_name: current_table_name, // Modify as needed
            });
        }

        println!("Tables: {:?}", res);

        Ok(res)
    }
}

impl MysqlAdapter {
    pub async fn execute_in_transaction(
        pool: Arc<Pool>,
        queries: Vec<String>,
    ) -> Result<(), QueryError> {
        let mut pool_conn = match pool
            .get_conn()
            .await
            .map_err(|err| QueryError::new(err.to_string(), "".to_string()))
        {
            Ok(value) => value,
            Err(err) => return Err(err),
        };

        let mut transaction = pool_conn
            .start_transaction(TxOpts::default())
            .await
            .map_err(|err| QueryError::new(err.to_string(), "".to_string()))?;
        for query in queries {
            transaction
                .exec_iter(query.clone().as_str(), Params::Empty)
                .await
                .map_err(|err| QueryError::new(err.to_string(), query.clone()))?;
        }

        transaction
            .commit()
            .await
            .map_err(|err| QueryError::new(err.to_string(), "".to_string()))?;
        Ok(())
    }
    pub fn new(db_config: DBConfig) -> Self {
        Self { db_config }
    }
    async fn fetch(
        pool: Arc<Pool>,
        query: String,
        debug_query: String,
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
                let res = match Self::fetch_raw(pool, query.clone(), debug_query.clone()).await {
                    Ok(value) => value,
                    Err(err) => return Err(err),
                };

                Ok(Self::convert_rows(&res))
            })
        }
        .await
        .map_err(|err| QueryError::new(err.to_string(), debug_query.clone()))?
        .map_err(|err| QueryError::new(err.to_string(), debug_query.clone()))?;
        Ok((str_rows, columns, column_details))
    }

    async fn fetch_raw(
        pool: Arc<Pool>,
        query: String,
        debug_query: String,
    ) -> Result<Vec<Row>, QueryError> {
        let mut pool_conn = match pool
            .get_conn()
            .await
            .map_err(|err| QueryError::new(err.to_string(), debug_query.clone()))
        {
            Ok(value) => value,
            Err(err) => return Err(err),
        };
        let res = match pool_conn
            .query(query.clone().as_str())
            .await
            .map_err(|err| QueryError::new(err.to_string(), debug_query.clone()))
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
            .map(|col| col.name_str().to_string())
            .collect::<Vec<String>>();
        for row in row_results {
            let str_row = Self::row_to_json(row);
            str_rows.push(str_row)
        }

        let column_details = Self::get_column_details(&row_results[0]);
        (str_rows, columns, column_details)
    }

    fn create_pool(&self) -> Result<Pool, String> {
        let mut mysql_config = mysql_async::OptsBuilder::default();
        mysql_config = mysql_config.user(Some(self.db_config.username.as_str()));

        mysql_config = mysql_config.pass(self.db_config.password.clone());
        mysql_config = mysql_config.ip_or_hostname(self.db_config.host_url.as_str());
        mysql_config = mysql_config.tcp_port(self.db_config.host_port);
        mysql_config = mysql_config.db_name(Some(self.db_config.db_name.as_str()));
        mysql_config = mysql_config.conn_ttl(Duration::from_secs(
            self.db_config.checkout_timeout.unwrap_or(45),
        ));
        Ok(Pool::new(mysql_config))
    }

    fn get_pool(&self, cps: &Arc<Mutex<ConnectionPools>>) -> Result<Arc<Pool>, QueryError> {
        let mut connection_pools = cps.lock().unwrap();
        let key = hashed_db_credentials(&self.db_config);
        let pool = match connection_pools.mysql.get(&key) {
            Some(p) => Arc::clone(p),
            None => {
                let p = Self::create_pool(self)
                    .map_err(|err| QueryError::new(err.to_string(), "".to_string()))?;
                let rc = Arc::new(p);
                connection_pools.mysql.insert(key, Arc::clone(&rc));
                Arc::clone(&rc)
            }
        };
        Ok(pool)
    }
    fn get_column_details(row: &Row) -> HashMap<String, ColumnDetail> {
        let mut column_details = HashMap::new();

        for column in row.columns().iter() {
            use mysql_async::consts::ColumnType::*;
            let (is_array, data_type) = match column.column_type() {
                MYSQL_TYPE_TINY
                | MYSQL_TYPE_SHORT
                | MYSQL_TYPE_INT24
                | MYSQL_TYPE_LONG
                | MYSQL_TYPE_LONGLONG
                | MYSQL_TYPE_DECIMAL
                | MYSQL_TYPE_NEWDECIMAL
                | MYSQL_TYPE_FLOAT
                | MYSQL_TYPE_DOUBLE
                | MYSQL_TYPE_YEAR => (false, DataType::Number),
                MYSQL_TYPE_TINY_BLOB
                | MYSQL_TYPE_MEDIUM_BLOB
                | MYSQL_TYPE_LONG_BLOB
                | MYSQL_TYPE_STRING
                | MYSQL_TYPE_VAR_STRING
                | MYSQL_TYPE_VARCHAR
                | MYSQL_TYPE_BLOB
                | MYSQL_TYPE_ENUM
                | MYSQL_TYPE_SET => (false, DataType::String),

                MYSQL_TYPE_DATE
                | MYSQL_TYPE_TIME
                | MYSQL_TYPE_DATETIME
                | MYSQL_TYPE_TIMESTAMP
                | MYSQL_TYPE_TIMESTAMP2
                | MYSQL_TYPE_DATETIME2
                | MYSQL_TYPE_TIME2
                | MYSQL_TYPE_NEWDATE => (false, DataType::DateTime),

                MYSQL_TYPE_JSON => (false, DataType::Json),

                MYSQL_TYPE_BIT => (false, DataType::Bool),
                _ => (false, DataType::String),
            };
            let column_detail = ColumnDetail::new(data_type, is_array);
            column_details.insert(column.name_str().to_string(), column_detail);
        }

        column_details
    }

    fn row_to_json(row: &Row) -> Vec<DBValue> {
        let mut r: Vec<DBValue> = vec![];

        for (i, column) in row.columns().iter().enumerate() {
            let value = match column.column_type() {
                mysql_async::consts::ColumnType::MYSQL_TYPE_DECIMAL => {
                    let v: Option<Decimal> = Self::convert_to_t(row, i);
                    DBValue::Decimal(v)
                }
                mysql_async::consts::ColumnType::MYSQL_TYPE_TINY => {
                    let v: Option<i8> = Self::convert_to_t(row, i);
                    DBValue::Int8(v)
                }
                mysql_async::consts::ColumnType::MYSQL_TYPE_SHORT => {
                    let v: Option<i16> = Self::convert_to_t(row, i);
                    DBValue::Int16(v)
                }
                mysql_async::consts::ColumnType::MYSQL_TYPE_LONG => {
                    let v: Option<i32> = Self::convert_to_t(row, i);
                    DBValue::Int32(v)
                }
                mysql_async::consts::ColumnType::MYSQL_TYPE_FLOAT => {
                    let v: Option<f32> = Self::convert_to_t(row, i);
                    DBValue::Float32(v)
                }
                mysql_async::consts::ColumnType::MYSQL_TYPE_DOUBLE => {
                    let v: Option<f64> = Self::convert_to_t(row, i);
                    DBValue::Float64(v)
                }
                mysql_async::consts::ColumnType::MYSQL_TYPE_NULL => {
                    DBValue::Strings(None) // Or any appropriate DBValue variant for NULL
                }
                mysql_async::consts::ColumnType::MYSQL_TYPE_TIMESTAMP => {
                    let v: Option<NaiveDateTime> = Self::convert_to_t(row, i);
                    DBValue::DateTime(v)
                }
                mysql_async::consts::ColumnType::MYSQL_TYPE_LONGLONG => {
                    let v: Option<i64> = Self::convert_to_t(row, i);
                    DBValue::Int64(v)
                }
                mysql_async::consts::ColumnType::MYSQL_TYPE_INT24 => {
                    let v: Option<i32> = Self::convert_to_t(row, i);
                    DBValue::Int32(v)
                }
                mysql_async::consts::ColumnType::MYSQL_TYPE_DATE => {
                    let v: Option<NaiveDate> = Self::convert_to_t(row, i);
                    DBValue::Date(v)
                }
                mysql_async::consts::ColumnType::MYSQL_TYPE_TIME => {
                    let v: Option<NaiveTime> = Self::convert_to_t(row, i);
                    DBValue::Time(v)
                }
                mysql_async::consts::ColumnType::MYSQL_TYPE_DATETIME => {
                    let v: Option<NaiveDateTime> = Self::convert_to_t(row, i);
                    DBValue::DateTime(v)
                }
                mysql_async::consts::ColumnType::MYSQL_TYPE_YEAR => {
                    let v: Option<i16> = Self::convert_to_t(row, i);
                    DBValue::Int16(v)
                }
                mysql_async::consts::ColumnType::MYSQL_TYPE_VARCHAR
                | mysql_async::consts::ColumnType::MYSQL_TYPE_VAR_STRING
                | mysql_async::consts::ColumnType::MYSQL_TYPE_STRING => {
                    let v: Option<String> = Self::convert_to_t(row, i);
                    DBValue::Strings(v)
                }
                mysql_async::consts::ColumnType::MYSQL_TYPE_BIT => {
                    let v: Option<bool> = Self::convert_to_t(row, i);
                    DBValue::Bool(v)
                }
                mysql_async::consts::ColumnType::MYSQL_TYPE_JSON => {
                    let v: Option<Value> = Self::convert_to_t(row, i);
                    DBValue::Json(v)
                }
                mysql_async::consts::ColumnType::MYSQL_TYPE_BLOB
                | mysql_async::consts::ColumnType::MYSQL_TYPE_TINY_BLOB
                | mysql_async::consts::ColumnType::MYSQL_TYPE_MEDIUM_BLOB
                | mysql_async::consts::ColumnType::MYSQL_TYPE_LONG_BLOB => {
                    let v: Option<Vec<u8>> = Self::convert_to_t(row, i);
                    DBValue::Strings(v.map(|bytes| String::from_utf8_lossy(&bytes).to_string()))
                }
                mysql_async::consts::ColumnType::MYSQL_TYPE_NEWDECIMAL => {
                    let v: Option<Decimal> = Self::convert_to_t(row, i);
                    DBValue::Decimal(v)
                }
                _ => {
                    // Handle unsupported types
                    DBValue::Strings(None)
                }
            };

            r.push(value);
        }

        r
    }

    fn convert_to_t<T>(row: &Row, i: usize) -> Option<T>
    where
        T: FromValue,
    {
        match row.get_opt(i) {
            Some(value) => match value {
                Ok(v) => Some(v),
                Err(_) => None,
            },
            None => None,
        }
    }
}
