use common::models::app_table::AppTable;
use common::models::schema::app_tables;
use diesel::PgConnection;

use diesel::dsl::not;

use diesel::prelude::*;
use diesel::result::Error;

pub trait AppTableRepository {
    fn find_by_app_id(conn: &mut PgConnection, app_id: i32) -> Result<Vec<AppTable>, Error>;
}

impl AppTableRepository for AppTable {
    fn find_by_app_id(conn: &mut PgConnection, app_id: i32) -> Result<Vec<Self>, Error> {
        app_tables::table
            .filter(app_tables::app_id.eq(app_id))
            .select(app_tables::all_columns)
            .load::<Self>(conn)
    }
}
