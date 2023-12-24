use diesel::PgConnection;

use crate::{
    repository::models::{OrganizationSetting, Setting, UserSetting},
    response_text::SMTP_CONFIG_FETCH_ERROR,
};

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

const SMTP_CONFIG_NAMES: [&str; 6] = [
    "EMAIL_USERNAME",
    "EMAIL_SERVER_HOSTNAME",
    "EMAIL_PASSWORD",
    "EMAIL_PORT",
    "EMAIL_SERVER",
    "SENDER_EMAIL_ID",
];

#[derive(Default)]
pub struct SMTPConfig {
    pub host: String,
    pub port: u16,
    pub username: String,
    pub password: String,
    pub sender_email: String,
    pub send_email_server_domain: String,
}

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

pub fn get_smtp_config(conn: &mut PgConnection) -> Result<SMTPConfig, String> {
    let settings = Setting::find_by_names(
        conn,
        SMTP_CONFIG_NAMES.iter().map(|s| s.to_string()).collect(),
    )
    .map_err(|_| SMTP_CONFIG_FETCH_ERROR.to_string())?;

    let mut config = SMTPConfig::default();
    for setting in settings {
        if let Some(value) = setting.value {
            match setting.name.as_str() {
                "EMAIL_SERVER" => config.host = value,
                "EMAIL_PORT" => config.port = value.parse::<u16>().unwrap_or(0 as u16),
                "EMAIL_USERNAME" => config.username = value,
                "EMAIL_PASSWORD" => config.password = value,
                "EMAIL_SERVER_HOSTNAME" => config.send_email_server_domain = value,
                "SENDER_EMAIL_ID" => config.sender_email = value,
                _ => (),
            }
        }
    }

    Ok(config)
}
