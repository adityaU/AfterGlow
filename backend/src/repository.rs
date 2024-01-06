use diesel::{
    r2d2::{self, ConnectionManager},
    PgConnection,
};
use dotenv::dotenv;
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

pub mod api_action;
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
pub mod schedule;
pub mod schema;
pub mod settings;
pub mod snippet;
pub mod table;
pub mod tag;
pub mod team;
pub mod user;
pub mod user_permission_set;
pub mod user_setting;
pub mod variable;
pub mod visualization;
