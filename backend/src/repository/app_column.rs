use common::models::app_column::AppColumn;
use common::models::schema::app_columns;
use diesel::PgConnection;

use diesel::prelude::*;
use diesel::result::Error;

pub trait AppColumnRepository {
    fn find_by_table_id(conn: &mut PgConnection, table_id: i64) -> Result<Vec<AppColumn>, Error>;
}

impl AppColumnRepository for AppColumn {
    fn find_by_table_id(conn: &mut PgConnection, table_id: i64) -> Result<Vec<Self>, Error> {
        app_columns::table
            .filter(app_columns::table_id.eq(table_id))
            .select(app_columns::all_columns)
            .order(app_columns::display_order)
            .load::<Self>(conn)
    }
}
