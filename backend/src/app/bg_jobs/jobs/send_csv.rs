use std::sync::Arc;

use serde::{Deserialize, Serialize};

use crate::app::{
    bg_jobs::{Error, JobEssentials, LLData},
    questions::config::QuestionConfig,
    results,
};

#[derive(Serialize, Deserialize, Debug)]
pub struct SendCSVJob {
    pub email: String,
    pub payload: QuestionConfig,
    pub user_id: i32,
    pub org_id: i64,
}

#[async_trait::async_trait]
impl JobEssentials for SendCSVJob {
    async fn execute(&self, data: Arc<LLData>) -> Result<(), Error> {
        // let conn = data.pool.get()
        // let data = results::fetch(, self.payload, & mut data.conn_pools, self.user_id, self.org_id)
        Ok(())
    }
}
