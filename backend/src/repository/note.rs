use super::{models::Note, schema::notes};

use diesel::prelude::*;
use diesel::result::Error;

impl Note {
    pub fn find_by_dashboard_id(conn: &mut PgConnection, did: i64) -> Result<Vec<Self>, Error> {
        notes::table
            .filter(notes::dashboard_id.eq(did))
            .load::<Self>(conn)
    }
}
