use diesel::{sql_query, PgConnection, RunQueryDsl};

use diesel::prelude::*;
use diesel::result::Error;

use crate::diesel::ExpressionMethods;

use super::models::{Schedule, ScheduleChangeset};
use super::schema::schedules;
const MAX_FAILED_ATTEMPTS: i16 = 5;
use diesel::sql_types::{Int4, Int8};

impl Schedule {
    pub fn create_or_update_for_dashboard(
        conn: &mut PgConnection,
        schedule_changeset: ScheduleChangeset,
        dashboard_id: i32,
    ) -> Result<Self, Error> {
        match Self::fetch_by_dashboard_id(conn, dashboard_id) {
            Ok(schedule) => match schedule.get(0) {
                Some(schedule) => Self::update(conn, schedule.id, schedule_changeset),
                None => Self::create(conn, schedule_changeset),
            },
            Err(_) => Self::create(conn, schedule_changeset),
        }
    }

    pub fn create_or_update_for_visualization(
        conn: &mut PgConnection,
        schedule_changeset: ScheduleChangeset,
        visualization_id: i64,
    ) -> Result<Self, Error> {
        match Self::fetch_by_visualization_id(conn, visualization_id) {
            Ok(schedule) => match schedule.get(0) {
                Some(schedule) => Self::update(conn, schedule.id, schedule_changeset),
                None => Self::create(conn, schedule_changeset),
            },
            Err(_) => Self::create(conn, schedule_changeset),
        }
    }
    pub fn fetch_all_active(conn: &mut PgConnection) -> Result<Vec<Self>, Error> {
        schedules::table
            .filter(schedules::is_active.eq(true))
            .load::<Self>(conn)
    }
    pub fn fetch_by_visualization_id(
        conn: &mut PgConnection,
        visualization_id: i64,
    ) -> Result<Vec<Self>, Error> {
        let query = sql_query(
            "select * from schedules where (job_details ->> 'visualization_id')::int = $1 limit 1",
        );

        let query = query.bind::<Int8, _>(visualization_id);

        query.load(conn)
    }

    pub fn fetch_by_dashboard_id(
        conn: &mut PgConnection,
        dashboard_id: i32,
    ) -> Result<Vec<Self>, Error> {
        let query = sql_query(
            "select * from schedules where (job_details ->> 'dashboard_id')::int = $1 limit 1",
        );

        let query = query.bind::<Int4, _>(dashboard_id);

        query.load(conn)
    }

    pub fn hashed_name(&self) -> String {
        format!("schedule_{}", self.id)
    }

    pub fn next_scheduled_time(&self) -> chrono::NaiveDateTime {
        todo!()
    }
}
