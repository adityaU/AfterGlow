use diesel::PgConnection;

use super::models::Column;
use super::schema::{columns_, tables};

use diesel::dsl::not;

use diesel::prelude::*;
use diesel::result::Error;

impl Column {
    pub fn find_by_tablename_and_database_id(
        conn: &mut PgConnection,
        table_name: String,
        database_id: i32,
    ) -> Result<Vec<Self>, Error> {
        columns_::table
            .inner_join(tables::table)
            .filter(
                tables::name
                    .eq(table_name.clone())
                    .or(tables::readable_table_name.eq(table_name))
                    .and(tables::database_id.eq(database_id)),
            )
            .select(columns_::all_columns)
            .load::<Self>(conn)
    }
    pub fn find_by_table_id(conn: &mut PgConnection, tid: i32) -> Result<Vec<Self>, Error> {
        columns_::table
            .filter(columns_::table_id.eq(tid))
            .order(columns_::name.asc())
            .load::<Self>(conn)
    }

    pub fn find_by_name_and_table_id(
        conn: &mut PgConnection,
        name: String,
        table_id: i32,
    ) -> Result<Self, Error> {
        columns_::table
            .filter(columns_::name.eq(name).and(columns_::table_id.eq(table_id)))
            .select(columns_::all_columns)
            .first::<Self>(conn)
    }

    pub fn delete_old_columns(
        conn: &mut PgConnection,
        names: &Vec<String>,
        table_id: i32,
    ) -> Result<(), Error> {
        conn.transaction::<_, Error, _>(|conn| {
            let column_ids = columns_::table
                .filter(not(columns_::name.eq_any(names)).and(columns_::table_id.eq(table_id)))
                .select(columns_::id)
                .load::<i32>(conn)?;
            diesel::delete(columns_::table.filter(columns_::id.eq_any(&column_ids)))
                .execute(conn)?;
            Ok(())
        })?;
        Ok(())
    }
}
