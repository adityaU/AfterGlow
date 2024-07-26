use diesel::PgConnection;

use crate::repository::models::{OrganizationSetting, Setting, UserSetting};

pub mod gen_ai;
pub mod init_config;
pub mod limit;
pub mod reports;
pub mod s3_config;
pub mod saml;
pub mod theme;

fn applicable_int_setting(
    conn: &mut PgConnection,
    user_id: i64,
    org_id: i64,
    setting_name: String,
    default: i64,
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

    default
}

pub fn applicable_str_setting(
    conn: &mut PgConnection,
    user_id: i64,
    org_id: i64,
    setting_name: String,
    default: String,
) -> String {
    let us = UserSetting::find_by_user_id_and_name(conn, user_id, setting_name.clone());
    if let Some(s) = us {
        return s;
    }
    let os = OrganizationSetting::find_by_org_id_and_name(conn, org_id, setting_name.clone());
    if let Some(s) = os {
        return s;
    }
    let s = Setting::find_by_name(conn, setting_name.clone());
    if let Some(s) = s {
        return s;
    }
    default
}
