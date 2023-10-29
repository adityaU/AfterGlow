use super::models::Table;
use super::schema::tables;

use diesel::result::Error;

use diesel::prelude::*;

use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};

impl Table {
    pub fn search(conn: &mut PgConnection, dbid: &i32, q: String) -> Result<Vec<Self>, Error> {
        tables::table
            .filter(
                tables::database_id
                    .eq(dbid)
                    .and(tables::name.ilike(format!("%{}%", q))),
            )
            .order(tables::name.asc())
            .select(tables::all_columns)
            .load::<Self>(conn)
    }
}
