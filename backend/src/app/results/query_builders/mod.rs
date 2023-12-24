use diesel::PgConnection;

pub mod postgres;

pub trait QueryBuilder {
    fn build(&self, conn: &mut PgConnection, user_id: i32, org_id: i64) -> Result<Queries, String>;
    // fn get_connection(Database) -> Pool<>
}

pub struct Queries {
    pub adapted_query: String,
    pub final_query: String,
}
