use chrono::Utc;
use diesel::{result::Error, ExpressionMethods, PgConnection};
use serde_json::Value;

use super::{
    models::{ResultsCache, ResultsCacheChangeset},
    schema::results_cache,
};
use diesel::{QueryDsl, RunQueryDsl};

impl ResultsCache {
    pub fn fetch_by_query(
        conn: &mut PgConnection,
        sql: String,
        viz_id: i64,
    ) -> Result<Option<Value>, Error> {
        let key = format!("Viz::{}", viz_id);

        results_cache::table
            .filter(results_cache::sql.eq(sql))
            .filter(results_cache::key.eq(key))
            .filter(results_cache::expiry_time.gt(Utc::now().naive_utc()))
            .select(results_cache::data)
            .first::<Option<Value>>(conn)
    }

    pub fn push_to_cache(
        conn: &mut PgConnection,
        sql: String,
        viz_id: i64,
        data: Value,
        expiry_time: i64,
    ) -> Result<(), Error> {
        let key = format!("Viz::{}", viz_id);
        let expiry_time = Utc::now().naive_utc() + chrono::Duration::seconds(expiry_time);
        let new_cache = ResultsCacheChangeset {
            key: Some(key),
            sql: Some(sql),
            data: Some(data),
            expiry_time: Some(expiry_time),
            inserted_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
        };
        diesel::insert_into(results_cache::table)
            .values(&new_cache)
            .on_conflict((results_cache::sql, results_cache::key))
            .do_update()
            .set((
                results_cache::data.eq(new_cache.data.clone()),
                results_cache::expiry_time.eq(new_cache.expiry_time),
            ))
            .execute(conn)?;
        Ok(())
    }
}
