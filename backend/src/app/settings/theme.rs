use diesel::PgConnection;
use serde::{Deserialize, Serialize};

use crate::{repository::models::Setting};

#[derive(Debug, Serialize, Deserialize)]
pub struct Theme {
    pub primary_color: String,
    pub secondary_color: String,
    pub tertiary_color: String,
    pub white_color: String,
    pub default_color: String,
}

impl Default for Theme {
    fn default() -> Self {
        Theme {
            primary_color: String::from("rgb(85 64 198)"),
            secondary_color: String::from("rgb(245 247 251)"),
            tertiary_color: String::from("rgb(255 255 255)"),
            white_color: String::from("rgb(255 255 255)"),
            default_color: String::from("rgb(32 33 36)"),
        }
    }
}

const THEME_CONFIG_NAMES: [&str; 5] = [
    "THEME_PRIMARY_COLOR",
    "THEME_SECONDARY_COLOR",
    "THEME_TERTIARY_COLOR",
    "THEME_WHITE_COLOR",
    "THEME_DEFAULT_COLOR",
];

pub fn get(conn: &mut PgConnection) -> Theme {
    let mut config = Theme::default();
    let settings = Setting::find_by_names(
        conn,
        THEME_CONFIG_NAMES.iter().map(|s| s.to_string()).collect(),
    );
    if let Err(_) = settings {
        return config;
    }

    for setting in settings.unwrap() {
        if let Some(value) = setting.value {
            match setting.name.as_str() {
                "THEME_PRIMARY_COLOR" => config.primary_color = value,
                "THEME_SECONDARY_COLOR" => config.secondary_color = value,
                "THEME_TERTIARY_COLOR" => config.tertiary_color = value,
                "THEME_WHITE_COLOR" => config.white_color = value,
                "THEME_DEFAULT_COLOR" => config.default_color = value,
                _ => (),
            }
        }
    }

    config
}
