use diesel::PgConnection;

use super::models::Column;
use super::schema::columns_;

use diesel::prelude::*;
use diesel::result::Error;

impl Column {
    pub fn find_by_table_id(conn: &mut PgConnection, tid: i32) -> Result<Vec<Self>, Error> {
        columns_::table
            .filter(columns_::table_id.eq(tid))
            .order(columns_::name.asc())
            .load::<Self>(conn)
    }
}
