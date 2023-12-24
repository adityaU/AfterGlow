use diesel::PgConnection;

use crate::{repository::models::Setting, response_text::S3_CONFIG_FETCH_ERROR};

#[derive(Debug, Default)]
pub struct S3Config {
    pub key: String,
    pub secret: String,
    pub region: String,
    pub bucket: String,
    pub use_signed_url: bool,
    pub signed_url_expiry: i64,
}
const S3_CONFIG_NAMES: [&str; 6] = [
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_REGION",
    "S3_BUCKET",
    "USE_SIGNED_S3_URLS_IN_MAILS",
    "S3_SIGNED_URL_TIMEOUT",
];

pub fn get(conn: &mut PgConnection) -> Result<S3Config, String> {
    let settings = Setting::find_by_names(
        conn,
        S3_CONFIG_NAMES.iter().map(|s| s.to_string()).collect(),
    )
    .map_err(|_| S3_CONFIG_FETCH_ERROR.to_string())?;

    let mut config = S3Config::default();
    for setting in settings {
        if let Some(value) = setting.value {
            match setting.name.as_str() {
                "AWS_ACCESS_KEY_ID" => config.key = value,
                "AWS_SECRET_ACCESS_KEY" => config.secret = value,
                "AWS_REGION" => config.region = value,
                "S3_BUCKET" => config.bucket = value,
                "USE_SIGNED_S3_URLS_IN_MAILS" => match value.as_str() {
                    "true" => config.use_signed_url = true,
                    "false" => config.use_signed_url = false,
                    _ => config.use_signed_url = true,
                },
                "S3_SIGNED_URL_TIMEOUT" => {
                    let timeout = value.parse::<i64>().unwrap_or(600);
                    config.signed_url_expiry = timeout;
                }
                _ => (),
            }
        }
    }

    Ok(config)
}
