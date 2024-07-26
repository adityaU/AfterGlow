use diesel::PgConnection;



use super::applicable_int_setting;

const DEFAULT_LIMIT: i64 = 2000;

pub fn applicable_frontend_limit(conn: &mut PgConnection, user_id: i64, org_id: i64) -> i64 {
    applicable_int_setting(
        conn,
        user_id,
        org_id,
        "MAX_FRONTEND_LIMIT".to_string(),
        DEFAULT_LIMIT,
    )
}

pub fn applicable_download_limit(conn: &mut PgConnection, user_id: i64, org_id: i64) -> i64 {
    applicable_int_setting(
        conn,
        user_id,
        org_id,
        "MAX_DOWNLOAD_LIMIT".to_string(),
        DEFAULT_LIMIT,
    )
}
