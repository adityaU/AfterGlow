use super::models::Snippet;
use super::schema::{snippets};

use diesel::result::Error;



use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};

impl Snippet {
    pub fn find_by_database_id(conn: &mut PgConnection, dbid: &i32) -> Result<Vec<Self>, Error> {
        snippets::table
            .filter(snippets::database_id.eq(dbid.clone() as i64))
            .order(snippets::name.asc())
            .select(snippets::all_columns)
            .load::<Self>(conn)
    }
}
