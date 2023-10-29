use diesel::PgConnection;

use crate::repository::models::{OrganizationSetting, Setting, UserSetting};

const REPORT_CONFIG_NAMES: [&str; 10] = [
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "EMAIL_USERNAME",
    "AWS_REGION",
    "S3_BUCKET",
    "EMAIL_SERVER_HOSTNAME",
    "EMAIL_PASSWORD",
    "EMAIL_PORT",
    "EMAIL_SERVER",
    "SENDER_EMAIL_ID",
];
pub fn is_report_config_complete(conn: &mut PgConnection) -> bool {
    let settings_data = Setting::find_by_names(
        conn,
        REPORT_CONFIG_NAMES.iter().map(|s| s.to_string()).collect(),
    );
    if let Err(_) = settings_data {
        return false;
    }

    let settings = settings_data.ok().unwrap();

    for c in REPORT_CONFIG_NAMES {
        let mut found = false;
        for s in &settings {
            if s.name == c.to_string() {
                found = true;
                continue;
            }
        }
        if !found {
            return false;
        }
    }

    true
}

pub fn is_download_allowed(conn: &mut PgConnection, user_id: i32, org_id: i64) -> bool {
    let setting_name = "DOWNLOAD_ALLOWED".to_string();
    let us = UserSetting::find_by_user_id_and_name(conn, user_id, setting_name.clone());
    if let Some(s) = us {
        match s.as_str() {
            "true" => return true,
            "false" => return false,
            _ => (),
        }
    }

    let os = OrganizationSetting::find_by_org_id_and_name(conn, org_id, setting_name.clone());

    if let Some(s) = os {
        match s.as_str() {
            "true" => return true,
            "false" => return false,
            _ => (),
        }
    }

    let s = Setting::find_by_name(conn, setting_name.clone());

    if let Some(s) = s {
        match s.as_str() {
            "true" => return true,
            "false" => return false,
            _ => (),
        }
    }

    true
}
