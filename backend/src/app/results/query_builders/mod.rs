use diesel::PgConnection;

pub mod mysql;
pub mod postgres;
pub mod redshift;
pub mod sql_base;

pub trait QueryBuilder {
    async fn build(
        &self,
        conn: &mut PgConnection,
        user_id: i64,
        org_id: i64,
    ) -> Result<Queries, String>;
    // fn get_connection(Database) -> Pool<>
}
#[derive(Debug)]
pub struct Queries {
    pub adapted_query: String,
    pub debug_query: String,
    pub db_query: String,
}
