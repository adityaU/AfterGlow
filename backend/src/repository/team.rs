use super::models::{
    SharedEntity, Team, TeamDatabase, TeamDatabaseChangeset, TeamShare, TeamShareChangeset,
    UserTeam, UserTeamChangeset,
};
use super::schema::{team_databases, team_shares, teams, user_teams};
use diesel::sql_types::{BigInt, Int8, Nullable};

use chrono::NaiveDateTime;
use diesel::dsl::sql;
use diesel::prelude::*;

use diesel::result::Error;
use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};

#[derive(Queryable, Debug)]
pub struct AccessibleDatabaseCount {
    pub team_id: Option<i64>,
    pub count: i64,
}

#[derive(Queryable, Debug)]
pub struct UserCount {
    pub team_id: Option<i64>,
    pub count: i64,
}

impl Team {
    pub fn find_by_name(conn: &mut PgConnection, name: String) -> Result<Self, Error> {
        teams::table
            .filter(teams::name.eq(name))
            .select(teams::all_columns)
            .first::<Self>(conn)
    }
    pub fn search(conn: &mut PgConnection, q: String) -> Result<Vec<Self>, Error> {
        teams::table
            .filter(teams::name.ilike(format!("%{}%", q)))
            .order(teams::name.asc())
            .select(teams::all_columns)
            .load::<Self>(conn)
    }
    pub fn find_by_user_id(conn: &mut PgConnection, uid: i64) -> Result<Vec<Self>, Error> {
        teams::table
            .inner_join(user_teams::table.on(teams::id.nullable().eq(user_teams::team_id)))
            .filter(user_teams::user_id.eq(uid))
            .select(teams::all_columns)
            .load::<Self>(conn)
    }
    pub fn remove_database(conn: &mut PgConnection, dbid: i64, tid: i64) -> Result<bool, Error> {
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

    pub fn add_database(conn: &mut PgConnection, dbid: i64, tid: i64) -> Result<bool, Error> {
        let changeset = TeamDatabaseChangeset {
            database_id: Some(dbid),
            team_id: Some(tid),
            inserted_at: NaiveDateTime::from_timestamp_opt(0, 0).unwrap(),
            updated_at: NaiveDateTime::from_timestamp_opt(0, 0).unwrap(),
        };
        TeamDatabase::create(conn, changeset)?;
        Ok(true)
    }

    pub fn remove_user(conn: &mut PgConnection, uid: i64, tid: i64) -> Result<bool, Error> {
        let query = diesel::delete(
            user_teams::table.filter(user_teams::team_id.eq(tid).and(user_teams::user_id.eq(uid))),
        );

        let _debug = diesel::debug_query::<diesel::pg::Pg, _>(&query);
        query.execute(conn)?;
        Ok(true)
    }

    pub fn add_user(conn: &mut PgConnection, uid: i64, tid: i64) -> Result<bool, Error> {
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
        team_ids: &Vec<i64>,
    ) -> Result<Vec<UserCount>, Error> {
        user_teams::table
            .filter(user_teams::team_id.eq_any(team_ids))
            .select(sql::<(Nullable<Int8>, BigInt)>(
                "team_id, COUNT(user_id) as count",
            ))
            .group_by(user_teams::team_id)
            .load::<UserCount>(conn)
    }

    pub fn find_accessible_databases_count(
        conn: &mut PgConnection,
        team_ids: &Vec<i64>,
    ) -> Result<Vec<AccessibleDatabaseCount>, Error> {
        team_databases::table
            .filter(team_databases::team_id.eq_any(team_ids))
            .select(sql::<(Nullable<Int8>, BigInt)>(
                "team_id, COUNT(database_id) as count",
            ))
            .group_by(team_databases::team_id)
            .load::<AccessibleDatabaseCount>(conn)
    }
}

impl TeamShare {
    pub fn delete_dashboard_shares_by_id(
        conn: &mut PgConnection,
        shared_id: i64,
    ) -> Result<usize, Error> {
        diesel::delete(
            team_shares::table.filter(
                team_shares::shared_id
                    .eq(shared_id)
                    .and(team_shares::shared_entity.eq(SharedEntity::Dashboard)),
            ),
        )
        .execute(conn)
    }

    pub fn delete_question_shares_by_id(
        conn: &mut PgConnection,
        shared_id: i64,
    ) -> Result<usize, Error> {
        diesel::delete(
            team_shares::table.filter(
                team_shares::shared_id
                    .eq(shared_id)
                    .and(team_shares::shared_entity.eq(SharedEntity::Question)),
            ),
        )
        .execute(conn)
    }
    pub fn create_or_update(
        conn: &mut PgConnection,
        changeset: TeamShareChangeset,
    ) -> Result<Self, Error> {
        diesel::insert_into(team_shares::table)
            .values(&changeset)
            .on_conflict((
                team_shares::team_id,
                team_shares::shared_id,
                team_shares::shared_entity,
            ))
            .do_update()
            .set(&changeset)
            .get_result(conn)
    }
    pub fn find_names_by_shared_id(
        conn: &mut PgConnection,
        shared_id: i64,
        shared_entity: SharedEntity,
    ) -> Result<Vec<String>, Error> {
        team_shares::table
            .filter(
                team_shares::shared_id
                    .eq(shared_id)
                    .and(team_shares::shared_entity.eq(shared_entity)),
            )
            .inner_join(teams::table.on(team_shares::team_id.eq(teams::id)))
            .select(teams::name)
            .load::<String>(conn)
    }

    pub fn delete_shares_by_team_id_and_shared_id(
        conn: &mut PgConnection,
        team_id: i64,
        shared_id: i64,
        shared_entity: SharedEntity,
    ) -> Result<usize, Error> {
        diesel::delete(
            team_shares::table.filter(
                team_shares::team_id
                    .eq(team_id)
                    .and(team_shares::shared_id.eq(shared_id))
                    .and(team_shares::shared_entity.eq(shared_entity)),
            ),
        )
        .execute(conn)
    }
}
