use super::models::{Team, TeamDatabase, TeamDatabaseChangeset, UserTeam, UserTeamChangeset};
use super::schema::{team_databases, teams, user_teams};
use diesel::sql_types::{BigInt, Int4, Nullable};

use chrono::NaiveDateTime;
use diesel::dsl::sql;
use diesel::prelude::*;

use diesel::result::Error;
use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};

#[derive(Queryable, Debug)]
pub struct AccessibleDatabaseCount {
    pub team_id: Option<i32>,
    pub count: i64,
}

#[derive(Queryable, Debug)]
pub struct UserCount {
    pub team_id: Option<i32>,
    pub count: i64,
}

impl Team {
    pub fn find_by_user_id(conn: &mut PgConnection, uid: i32) -> Result<Vec<Self>, Error> {
        teams::table
            .inner_join(user_teams::table.on(teams::id.nullable().eq(user_teams::team_id)))
            .filter(user_teams::user_id.eq(uid))
            .select(teams::all_columns)
            .load::<Self>(conn)
    }
    pub fn remove_database(conn: &mut PgConnection, dbid: i32, tid: i32) -> Result<bool, Error> {
        let query = diesel::delete(
            team_databases::table.filter(
                team_databases::team_id
                    .eq(tid)
                    .and(team_databases::database_id.eq(dbid)),
            ),
        );

        let _debug = diesel::debug_query::<diesel::pg::Pg, _>(&query);
        query.execute(conn)?;
        Ok(true)
    }

    pub fn add_database(conn: &mut PgConnection, dbid: i32, tid: i32) -> Result<bool, Error> {
        let changeset = TeamDatabaseChangeset {
            database_id: Some(dbid),
            team_id: Some(tid),
            inserted_at: NaiveDateTime::from_timestamp_opt(0, 0).unwrap(),
            updated_at: NaiveDateTime::from_timestamp_opt(0, 0).unwrap(),
        };
        TeamDatabase::create(conn, changeset)?;
        Ok(true)
    }

    pub fn remove_user(conn: &mut PgConnection, uid: i32, tid: i32) -> Result<bool, Error> {
        let query = diesel::delete(
            user_teams::table.filter(user_teams::team_id.eq(tid).and(user_teams::user_id.eq(uid))),
        );

        let _debug = diesel::debug_query::<diesel::pg::Pg, _>(&query);
        query.execute(conn)?;
        Ok(true)
    }

    pub fn add_user(conn: &mut PgConnection, uid: i32, tid: i32) -> Result<bool, Error> {
        let changeset = UserTeamChangeset {
            user_id: Some(uid),
            team_id: Some(tid),
            inserted_at: NaiveDateTime::from_timestamp_opt(0, 0).unwrap(),
            updated_at: NaiveDateTime::from_timestamp_opt(0, 0).unwrap(),
        };
        UserTeam::create(conn, changeset)?;
        Ok(true)
    }

    pub fn find_users_count(
        conn: &mut PgConnection,
        team_ids: &Vec<i32>,
    ) -> Result<Vec<UserCount>, Error> {
        user_teams::table
            .filter(user_teams::team_id.eq_any(team_ids))
            .select(sql::<(Nullable<Int4>, BigInt)>(
                "team_id, COUNT(user_id) as count",
            ))
            .group_by(user_teams::team_id)
            .load::<UserCount>(conn)
    }

    pub fn find_accessible_databases_count(
        conn: &mut PgConnection,
        team_ids: &Vec<i32>,
    ) -> Result<Vec<AccessibleDatabaseCount>, Error> {
        team_databases::table
            .filter(team_databases::team_id.eq_any(team_ids))
            .select(sql::<(Nullable<Int4>, BigInt)>(
                "team_id, COUNT(database_id) as count",
            ))
            .group_by(team_databases::team_id)
            .load::<AccessibleDatabaseCount>(conn)
    }
}
