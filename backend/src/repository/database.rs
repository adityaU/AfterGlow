use super::models::Database;
use super::schema::{databases, team_databases};

use diesel::result::Error;

use diesel::prelude::*;

use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};

impl Database {
    pub fn search(
        conn: &mut PgConnection,
        query: String,
        _current_user_email: String,
        _permissions: Vec<String>,
    ) -> Result<Vec<Self>, Error> {
        databases::table
            .filter(databases::name.ilike(format!("%{}%", query)))
            .order(databases::name.asc())
            .load::<Self>(conn)
    }
    pub fn sorted_index(conn: &mut PgConnection) -> Result<Vec<Self>, Error> {
        databases::table
            .order(databases::name.asc())
            .load::<Self>(conn)
    }
    pub fn find_by_team_id(conn: &mut PgConnection, tid: i32) -> Result<Vec<Self>, Error> {
        databases::table
            .inner_join(
                team_databases::table.on(databases::id.nullable().eq(team_databases::database_id)),
            )
            .filter(team_databases::team_id.eq(tid))
            .order(databases::name.asc())
            .select(databases::all_columns)
            .load::<Self>(conn)
    }
}
