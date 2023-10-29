#![recursion_limit = "2048"]
extern crate diesel;
extern crate dotenv; // load big decimal

use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

use actix_web::{middleware::Logger, web::Data, App, HttpServer};
use app::bg_jobs::{pg_queue::PostgresQueue, worker, LLData};
// use diesel::prelude::*;
use dotenv::dotenv;

// Load Models and schema

mod app;
mod config;
mod errors;
mod repository;
mod router;
mod views;

mod controllers;
pub mod response_text;

use repository::Database;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let connection_pools = Arc::new(Mutex::new(app::results::ConnectionPools {
        postgres: HashMap::new(),
    }));

    let pool = Arc::new(Database::new().pool);

    //setup workers
    let queue = Arc::new(PostgresQueue::new(Database::new().pool));

    let ll_data = LLData::new(pool.clone(), connection_pools.clone());

    let queue_clone = queue.clone();
    tokio::spawn(async move { worker::run(queue_clone, Arc::new(ll_data)).await });

    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(pool.clone()))
            .app_data(Data::new(queue.clone()))
            .app_data(Data::new(connection_pools.clone()))
            .wrap(Logger::new("%a \"%r\" %s %b  \"%{User-Agent}i\" %Dms"))
            .configure(router::config)
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
