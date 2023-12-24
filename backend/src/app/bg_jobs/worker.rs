use std::{sync::Arc, time::Duration};

use super::{LongLivedData, Queue};
use futures::{stream, StreamExt};

const CONCURRENCY: u32 = 50;

pub async fn run(queue: Arc<dyn Queue>, data: Arc<LongLivedData>) {
    loop {
        let queue = queue.clone();
        let jobs = match queue.pull(CONCURRENCY).await {
            Ok(jobs) => jobs,

            Err(err) => {
                println!("Worker Error: {}", err);
                tokio::time::sleep(Duration::from_millis(500)).await;

                Vec::new()
            }
        };

        stream::iter(jobs)
            .for_each_concurrent(CONCURRENCY as usize, |job| {
                let queue = queue.clone();
                let data = data.clone();
                async move {
                    let job_id = job.id;

                    let job_data = job.execute(data);

                    let res = match job_data.await {
                        Ok(_) => queue.delete_job(job_id).await,
                        Err(err) => {
                            println!("Worker Error for ID: {}, Error: {}", job_id, &err);
                            queue.fail_job(job_id).await
                        }
                    };

                    match res {
                        Ok(_) => {}
                        Err(err) => {
                            println!("Worker Error: {}", &err);
                        }
                    }
                }
            })
            .await;

        tokio::time::sleep(Duration::from_millis(125)).await;
    }
}
