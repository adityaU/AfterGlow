use std::{str::FromStr, time::Duration};

use deadpool_postgres::{Manager, ManagerConfig, Pool, RecyclingMethod};
use diesel::{
    r2d2::{self, ConnectionManager},
    PgConnection,
};
use dotenv::dotenv;
use tokio_postgres::NoTls;
pub type DBPool = r2d2::Pool<ConnectionManager<PgConnection>>;

pub struct Database {
    pub pool: DBPool,
}

impl Database {
    pub fn new() -> Self {
        dotenv().ok();
        let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
        let manager = ConnectionManager::<PgConnection>::new(database_url);
        let pool: DBPool = r2d2::Pool::builder()
            .build(manager)
            .expect("Failed to create pool.");
        Database { pool }
    }
}

pub struct RawConnection {}

impl RawConnection {
    pub fn make() -> Pool {
        let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
        let mut pg_config = tokio_postgres::Config::from_str(&database_url).expect("Invalid URL");
        pg_config.connect_timeout(Duration::from_secs(45));
        let mgr_config = ManagerConfig {
            recycling_method: RecyclingMethod::Fast,
        };
        let mgr = Manager::from_config(pg_config, NoTls, mgr_config);
        Pool::builder(mgr)
            .max_size(20)
            .build()
            .expect("Failed to create pool.")
    }
}

pub mod api_action;
pub mod app_column;
pub mod app_table;
pub mod audit_log;
pub mod bg_job;
pub mod column;
pub mod dashboard;
pub mod database;
pub mod models;
pub mod note;
pub mod organization;
pub mod organization_setting;
pub mod permission_set;
pub mod permissions;
pub mod question;
pub mod results_cache;
pub mod schedule;
pub mod schema;
pub mod settings;
pub mod snippet;
pub mod system_variable;
pub mod table;
pub mod tag;
pub mod team;
pub mod user;
pub mod user_permission_set;
pub mod user_setting;
pub mod variable;
pub mod visualization;
