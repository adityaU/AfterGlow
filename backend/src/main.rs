#![recursion_limit = "2048"]
extern crate diesel;
extern crate dotenv; // load big decimal

use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

use actix_web::{middleware::Logger, web::Data, App, HttpServer};
use app::bg_jobs::{pg_queue::PostgresQueue, scheduled_worker, worker, LongLivedData};
// use diesel::prelude::*;
use clap::{self, Command};
use diesel::migration::Migration;
use diesel_migrations::embed_migrations;
use diesel_migrations::{EmbeddedMigrations, MigrationHarness};
use dotenv::dotenv;
// Load Models and schema
//
//

mod app;
mod config;
mod errors;
mod repository;
mod router;
mod views;

mod controllers;
pub mod response_text;
pub mod seeds;

use repository::Database;

const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

fn main() -> std::io::Result<()> {
    let matches = Command::new("backend")
        .version("1.0")
        .author("Author Name")
        .about("Runs Diesel migrations or starts Actix server")
        .subcommand(Command::new("serve"))
        .about("Runs backend server")
        .subcommand(Command::new("migrate"))
        .about("Runs schema migrations")
        .get_matches();

    // Check the action
    match matches.subcommand_name() {
        Some("migrate") => run_migrations(),
        Some("serve") => run_server()?,
        _ => eprintln!("Invalid action"),
    }

    Ok(())
}

fn run_migrations() {
    println!("Running migrations...");
    let pool = Database::new().pool;
    let mut conn = pool.get().unwrap();
    conn.run_pending_migrations(MIGRATIONS)
        .expect("Could not run migrations");
    seeds::create_default_users(pool.clone());
    seeds::create_default_settings(pool);
    // You would typically call diesel_migrations::run_pending_migrations here
}

#[actix_web::main]
async fn run_server() -> std::io::Result<()> {
    dotenv().ok();

    let connection_pools = Arc::new(Mutex::new(app::results::ConnectionPools {
        postgres: HashMap::new(),
    }));

    let pool = Arc::new(Database::new().pool);

    //setup workers
    let queue = Arc::new(PostgresQueue::new(Database::new().pool));

    let ll_data = Arc::new(LongLivedData::new(pool.clone(), connection_pools.clone()));

    let queue_clone1 = queue.clone();
    let queue_clone2 = queue.clone();
    let ll_data_clone1 = ll_data.clone();
    let ll_data_clone2 = ll_data.clone();
    tokio::spawn(async move { worker::run(queue_clone1, ll_data_clone1).await });
    tokio::spawn(async move { scheduled_worker::run(queue_clone2, ll_data_clone2).await });

    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(pool.clone()))
            .app_data(Data::new(queue.clone()))
            .app_data(Data::new(connection_pools.clone()))
            .wrap(Logger::new("%a \"%r\" %s %b  \"%{User-Agent}i\" %Dms"))
            .configure(router::config)
    })
    .bind("0.0.0.0:4300")?
    .run()
    .await
}
