use super::models::Database;
use super::schema::{databases, team_databases};

use diesel::dsl::sql;
use diesel::result::Error;

use diesel::prelude::*;

use diesel::sql_types::Bool;
use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};

impl databases::table {
    pub fn shared_with_user(user_email: String, permissions: Vec<String>) -> String {
        if permissions.contains(&"Settings.all".to_string()) {
            return "databases.id = ANY(select databases.id from databases)".into();
        }

        format!(
            "databases.id = ANY(select d.id from databases d
        left join team_databases td
        on td.database_id = d.id
        left join teams t
        on t.id = td.team_id
        left join user_teams ut
        on ut.team_id = t.id
        left join users u
        on u.id = ut.user_id
        where u.email = '{}'
        )",
            user_email
        )
    }
}

impl Database {
    pub fn search(
        conn: &mut PgConnection,
        query: String,
        user_email: String,
        permissions: Vec<String>,
    ) -> Result<Vec<Self>, Error> {
        databases::table
            .filter(sql::<Bool>(
                databases::table::shared_with_user(user_email, permissions).as_str(),
            ))
            .filter(databases::name.ilike(format!("%{}%", query)))
            .order(databases::name.asc())
            .load::<Self>(conn)
    }
    pub fn sorted_index(
        conn: &mut PgConnection,
        user_email: String,
        permissions: Vec<String>,
    ) -> Result<Vec<Self>, Error> {
        databases::table
            .filter(sql::<Bool>(
                databases::table::shared_with_user(user_email, permissions).as_str(),
            ))
            .order(databases::name.asc())
            .load::<Self>(conn)
    }
    pub fn find_by_team_id(conn: &mut PgConnection, tid: i64) -> Result<Vec<Self>, Error> {
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
