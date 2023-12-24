

use diesel::{sql_query, PgConnection, RunQueryDsl};

use uuid::Uuid;

use chrono::Utc;

use diesel::prelude::*;
use diesel::result::Error;

use crate::diesel::BoolExpressionMethods;
use crate::diesel::ExpressionMethods;
use diesel::sql_types::{Int2, Int4, Timestamp, Uuid as PgUuid};

use super::models::{BgJob, JobStatus};
use super::schema::bg_queue;
const MAX_FAILED_ATTEMPTS: i16 = 5;

impl BgJob {
    pub fn next_named_jobs(conn: &mut PgConnection) -> Result<Vec<Self>, Error> {
        let now = Utc::now().naive_utc();
        bg_queue::table
            .filter(
                bg_queue::scheduled_for
                    .gt(now)
                    .and(bg_queue::name.is_not_null()),
            )
            .order(bg_queue::scheduled_for.asc())
            .load::<Self>(conn)
    }
    pub fn delete_all(conn: &mut PgConnection) -> Result<(), Error> {
        sql_query("Delete from bg_queue").execute(conn)?;
        Ok(())
    }

    pub fn fail(conn: &mut PgConnection, job_id: Uuid) -> Result<(), Error> {
        let query = sql_query(
            "UPDATE bg_queue
            SET status = ?, updated_at = ?, failed_attempts = failed_attempts + 1
            WHERE id = ?",
        );
        let _query = query
            .bind::<Int4, _>(JobStatus::Queued)
            .bind::<Timestamp, _>(Utc::now().naive_utc())
            .bind::<PgUuid, _>(job_id)
            .execute(conn)?;

        Ok(())
    }
    pub fn pull(conn: &mut PgConnection, number_of_jobs: i32) -> Result<Vec<Self>, Error> {
        let query = sql_query(
            "UPDATE bg_queue
            SET status = $1, updated_at = $2
            WHERE id IN (
                SELECT id
                FROM bg_queue
                WHERE status = $3 AND scheduled_for <= $4 AND failed_attempts < $5
                ORDER BY scheduled_for
                FOR UPDATE SKIP LOCKED
                LIMIT $6
            )

            RETURNING *",
        );
        let now = Utc::now().naive_utc();

        let query = query
            .bind::<Int4, _>(JobStatus::Running)
            .bind::<Timestamp, _>(now)
            .bind::<Int4, _>(JobStatus::Queued)
            .bind::<Timestamp, _>(now)
            .bind::<Int2, _>(MAX_FAILED_ATTEMPTS)
            .bind::<Int4, _>(number_of_jobs);

        query.load(conn)
    }
}
