use serde_json::json;
use ulid::Ulid;
use uuid::Uuid;

use chrono::NaiveDateTime;

use crate::repository::{
    models::{BgJob, BgJobChangeset, JobStatus},
    DBPool,
};

use super::{Error, Message};

pub struct PostgresQueue {
    pool: DBPool,
    max_attempts: u32,
}

impl PostgresQueue {
    pub fn new(pool: DBPool) -> PostgresQueue {
        let queue = PostgresQueue {
            pool,
            max_attempts: 5,
        };

        queue
    }
}

#[async_trait::async_trait]
impl super::Queue for PostgresQueue {
    async fn next_named_jobs(&self) -> Result<Vec<BgJob>, Error> {
        let conn = self.pool.get();
        let jobs = BgJob::next_named_jobs(&mut conn.unwrap())
            .map_err(|e| Error::CouldNotPullJobs(e.to_string()))?;
        Ok(jobs)
    }

    async fn push_job(
        &self,
        job: Message,
        name: Option<String>,
        date: Option<NaiveDateTime>,
    ) -> Result<(), Error> {
        let scheduled_for = date.unwrap_or(chrono::Utc::now().naive_utc());
        let failed_attempts: i32 = 0;
        let message = json!(job);
        let status = JobStatus::Queued;
        let now = chrono::Utc::now().naive_utc();
        let job_id: Uuid = Uuid::from_u128(Ulid::new().0);
        let cs = BgJobChangeset {
            id: job_id,
            inserted_at: now,
            updated_at: now,
            scheduled_for,
            failed_attempts,
            status,
            message,
            name,
        };

        let conn = self.pool.get();

        BgJob::create(&mut conn.unwrap(), cs).map_err(|e| Error::BgJobNotCreated(e.to_string()))?;

        Ok(())
    }
    async fn push(&self, job: Message, date: Option<NaiveDateTime>) -> Result<(), Error> {
        self.push_job(job, None, date).await
    }

    async fn pull(&self, number_of_jobs: u32) -> Result<Vec<super::Job>, Error> {
        let _now = chrono::Utc::now();
        let conn = self.pool.get();

        let jobs = BgJob::pull(&mut conn.unwrap(), number_of_jobs.try_into().unwrap_or(0))
            .map_err(|e| Error::CouldNotPullJobs(e.to_string()))?;
        Ok(jobs.into_iter().map(Into::into).collect())
    }

    async fn delete_job(&self, job_id: Uuid) -> Result<(), Error> {
        let conn = self.pool.get();
        BgJob::delete(&mut conn.unwrap(), job_id)
            .map_err(|e| Error::CouldNotDeleteJob(e.to_string()))
    }
    async fn fail_job(&self, job_id: Uuid) -> Result<(), Error> {
        let conn = self.pool.get();
        BgJob::fail(&mut conn.unwrap(), job_id).map_err(|e| Error::CouldNotFailJob(e.to_string()))
    }
    async fn clear(&self) -> Result<(), Error> {
        let conn = self.pool.get();
        BgJob::delete_all(&mut conn.unwrap()).map_err(|e| Error::CouldNotClearQueue(e.to_string()))
    }
}
