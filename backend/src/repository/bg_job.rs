use crud_derive::{Changeset, DatabaseEnum, View};
use diesel::deserialize::{self, FromSql};
use diesel::serialize::{self, Output, ToSql};
use diesel::{debug_query, sql_query, PgConnection, RunQueryDsl};
use diesel::{deserialize::FromSqlRow, expression::AsExpression};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;

use chrono::{NaiveDateTime, Utc};
use diesel::pg::PgValue;

use diesel::result::Error;

use diesel::pg::Pg;

use diesel::sql_types::{Int2, Int4, Timestamp, Uuid as PgUuid};

use super::models::{BgJob, JobStatus};
const MAX_FAILED_ATTEMPTS: i16 = 5;

impl BgJob {
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
        let query = query
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
