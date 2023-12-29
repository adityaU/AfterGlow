use diesel::PgConnection;

pub mod postgres;
pub mod redshift;
pub mod sql_base;

pub trait QueryBuilder {
    fn build(&self, conn: &mut PgConnection, user_id: i64, org_id: i64) -> Result<Queries, String>;
    // fn get_connection(Database) -> Pool<>
}

pub struct Queries {
    pub adapted_query: String,
    pub final_query: String,
}
