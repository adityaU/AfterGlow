pub mod jobs;
pub mod pg_queue;
pub mod scheduled_worker;
pub mod worker;

use std::{
    fmt,
    sync::{Arc, Mutex},
};

use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::repository::{models::BgJob, DBPool};

use self::jobs::{
    dashboard_mailer::{DashboardMailerError, DashboardMailerJob},
    send_csv::{SendCSVError, SendCSVJob},
    sync_db::{SyncDBError, SyncDBJob},
    visualization_mailer::{VisualizationMailerError, VisualizationMailerJob},
};

use super::results;

#[async_trait::async_trait]
pub trait Queue: Send + Sync {
    async fn push(&self, job: Message, scheduled_for: Option<NaiveDateTime>) -> Result<(), Error>;
    /// pull fetches at most `number_of_jobs` from the queue.
    async fn pull(&self, number_of_jobs: u32) -> Result<Vec<Job>, Error>;
    async fn delete_job(&self, job_id: Uuid) -> Result<(), Error>;
    async fn fail_job(&self, job_id: Uuid) -> Result<(), Error>;
    async fn next_named_jobs(&self) -> Result<Vec<BgJob>, Error>;

    async fn clear(&self) -> Result<(), Error>;

    async fn push_job(
        &self,
        job: Message,
        name: Option<String>,
        date: Option<NaiveDateTime>,
    ) -> Result<(), Error>;
}

#[async_trait::async_trait]
pub trait JobEssentials: Send + Sync {
    async fn execute(&self, data: Arc<LongLivedData>) -> Result<(), Error>;
}

pub struct LongLivedData {
    conn_pools: Arc<Mutex<results::ConnectionPools>>,
    pool: Arc<DBPool>,
}

impl LongLivedData {
    pub fn new(
        pool: Arc<DBPool>,
        conn_pools: Arc<Mutex<results::ConnectionPools>>,
    ) -> LongLivedData {
        LongLivedData { pool, conn_pools }
    }
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub enum Message {
    #[default]
    NoOP,
    SendCSV(SendCSVJob),
    SyncDB(SyncDBJob),
    DashboardMailer(DashboardMailerJob),
    VisualizationMailer(VisualizationMailerJob),
}

#[derive(Debug)]
pub enum Error {
    NoOpShouldNotBeCalled,
    JobNotFound(String),
    BgJobNotCreated(String),
    CouldNotPullJobs(String),
    CouldNotDeleteJob(String),
    CouldNotClearQueue(String),
    CouldNotFailJob(String),
    ErrorExecutingJob(String),
    SendCSVError(SendCSVError),
    SyncDBError(SyncDBError),
    ScheduledVisualizationMailerError(VisualizationMailerError),
    ScheduledDashboardMailerError(DashboardMailerError),
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Error::JobNotFound(msg) => write!(f, "Job not found: {}", msg),
            Error::BgJobNotCreated(msg) => write!(f, "Background job not created: {}", msg),
            Error::CouldNotPullJobs(msg) => write!(f, "Could not pull jobs: {}", msg),
            Error::CouldNotDeleteJob(msg) => write!(f, "Could not delete job: {}", msg),
            Error::CouldNotClearQueue(msg) => write!(f, "Could not clear queue: {}", msg),
            Error::CouldNotFailJob(msg) => write!(f, "Could not fail job: {}", msg),
            Error::ErrorExecutingJob(msg) => write!(f, "Could not Execute Job: {}", msg),
            Error::NoOpShouldNotBeCalled => write!(f, "No Op Job Should not be called"),
            Error::SendCSVError(err) => write!(f, "{}", err),
            Error::SyncDBError(err) => write!(f, "{}", err),
            Error::ScheduledVisualizationMailerError(err) => write!(f, "{}", err),
            Error::ScheduledDashboardMailerError(err) => write!(f, "{}", err),
        }
    }
}

impl std::error::Error for Error {}

#[derive(Debug, Serialize, Deserialize)]
pub struct Job {
    pub id: Uuid,
    pub message: Message,
}

impl From<BgJob> for Job {
    fn from(item: BgJob) -> Self {
        Job {
            id: item.id,
            message: serde_json::from_value(item.message)
                .ok()
                .unwrap_or_default(),
        }
    }
}

impl Job {
    async fn execute(&self, data: Arc<LongLivedData>) -> Result<(), Error> {
        match &self.message {
            Message::NoOP => Err(Error::NoOpShouldNotBeCalled),
            Message::SendCSV(m) => m.execute(data).await,
            Message::SyncDB(m) => m.execute(data).await,
            Message::DashboardMailer(m) => m.execute(data).await,
            Message::VisualizationMailer(m) => m.execute(data).await,
        }
    }
}
