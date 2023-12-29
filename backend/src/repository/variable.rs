use super::models::Variable;
use super::schema::variables;

use diesel::result::Error;

use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};

impl Variable {
    pub fn find_by_dashboard_id(conn: &mut PgConnection, did: i64) -> Result<Vec<Self>, Error> {
        variables::table
            .filter(variables::dashboard_id.eq(did))
            .load::<Self>(conn)
    }

    pub fn find_by_question_id(conn: &mut PgConnection, qid: i64) -> Result<Vec<Self>, Error> {
        variables::table
            .filter(variables::question_id.eq(qid))
            .load::<Self>(conn)
    }
    pub fn delete_by_question_id(conn: &mut PgConnection, qid: i64) -> Result<(), Error> {
        diesel::delete(variables::table.filter(variables::question_id.eq(qid))).execute(conn)?;
        Ok(())
    }
}
