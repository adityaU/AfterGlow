use super::models::{Variable, VariableView};
use super::schema::variables;

use diesel::result::Error;

use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};

use std::hash::{Hash, Hasher};

impl PartialEq for VariableView {
    fn eq(&self, other: &Self) -> bool {
        self.name == other.name
    }
}

impl Eq for VariableView {}

impl Hash for VariableView {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.name.hash(state);
    }
}

impl Variable {
    pub fn find_by_ids(conn: &mut PgConnection, ids: Vec<i64>) -> Result<Vec<Self>, Error> {
        variables::table
            .filter(variables::id.eq_any(ids))
            .load::<Self>(conn)
    }
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
