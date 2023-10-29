use super::{models::Dashboard, schema::dashboards};

use diesel::prelude::*;
use diesel::result::Error;

impl Dashboard {
    pub fn sorted_index(conn: &mut PgConnection) -> Result<Vec<Self>, Error> {
        dashboards::table
            .order(dashboards::title.asc())
            .load::<Self>(conn)
    }
}
