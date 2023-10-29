use super::models::Variable;
use super::schema::variables;


use diesel::result::Error;

use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};

impl Variable {
    pub fn find_by_dashboard_id(conn: &mut PgConnection, did: i32) -> Result<Vec<Self>, Error> {
        variables::table
            .filter(variables::dashboard_id.eq(did))
            .load::<Self>(conn)
    }
}
