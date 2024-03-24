use diesel::PgConnection;
use serde::Serialize;

use crate::{repository::models::Setting, response_text::INIT_CONFIG_FETCH_ERROR};

use super::theme::{self, Theme};

const INIT_CONFIGS: [&str; 2] = ["GOOGLE_LOGIN_ENABLED", "SAML_LOGIN_ENABLED"];

#[derive(Debug, Default, Serialize)]
pub struct InitConfiguration {
    google_login_enabled: bool,
    saml_login_enabled: bool,
    theme: Theme,
}

pub fn get(conn: &mut PgConnection) -> Result<InitConfiguration, String> {
    let settings =
        Setting::find_by_names(conn, INIT_CONFIGS.iter().map(|s| s.to_string()).collect())
            .map_err(|_| INIT_CONFIG_FETCH_ERROR.to_string())?;

    let mut config = InitConfiguration::default();
    config.theme = theme::get(conn);
    for setting in settings {
        if let Some(value) = setting.value {
            match setting.name.as_str() {
                "GOOGLE_LOGIN_ENABLED" => {
                    config.google_login_enabled = value.parse::<bool>().unwrap_or(false)
                }
                "SAML_LOGIN_ENABLED" => {
                    config.saml_login_enabled = value.parse::<bool>().unwrap_or(false)
                }
                _ => (),
            }
        }
    }
    Ok(config)
}
