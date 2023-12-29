use diesel::PgConnection;

use crate::repository::models::{OrganizationSetting, Setting, UserSetting};

const DEFAULT_LIMIT: i64 = 2000;

fn applicable_setting(
    conn: &mut PgConnection,
    user_id: i64,
    org_id: i64,
    setting_name: String,
) -> i64 {
    let us = UserSetting::find_by_user_id_and_name(conn, user_id, setting_name.clone());
    if let Some(s) = us {
        match s.parse() {
            Ok(n) => return n,
            _ => (),
        };
    }

    let os = OrganizationSetting::find_by_org_id_and_name(conn, org_id, setting_name.clone());

    if let Some(s) = os {
        match s.parse() {
            Ok(n) => return n,
            _ => (),
        };
    }

    let s = Setting::find_by_name(conn, setting_name.clone());

    if let Some(s) = s {
        match s.parse() {
            Ok(n) => return n,
            _ => (),
        };
    }

    DEFAULT_LIMIT
}

pub fn applicable_frontend_limit(conn: &mut PgConnection, user_id: i64, org_id: i64) -> i64 {
    applicable_setting(conn, user_id, org_id, "MAX_FRONTEND_LIMIT".to_string())
}

pub fn applicable_download_limit(conn: &mut PgConnection, user_id: i64, org_id: i64) -> i64 {
    applicable_setting(conn, user_id, org_id, "MAX_DOWNLOAD_LIMIT".to_string())
}
