use chrono::Utc;
use diesel::PgConnection;

use crate::app::settings::gen_ai::{
    GenAIProvider, DEFAULT_CLAUDE_API_URL, DEFAULT_CLAUDE_MODEL_NAME, DEFAULT_OLAMA_MODEL_NAME,
    DEFAULT_OLLAMA_API_URL, DEFAULT_OPENAI_API_URL, DEFAULT_OPENAI_MODEL_NAME,
};
use crate::app::settings::reports::REPORT_CONFIG_NAMES;
use crate::app::settings::saml::generate_saml_keys;

use super::models::SettingChangeset;
use super::{models::Setting, schema::settings};
use diesel::result::Error;

use diesel::{expression_methods::ExpressionMethods, QueryDsl, RunQueryDsl};

impl Setting {
    pub fn create_defaults(conn: &mut PgConnection) -> Result<(), Error> {
        for setting in REPORT_CONFIG_NAMES {
            let _ = Setting::find_by_name_or_create(conn, setting.to_string(), "".to_string());
        }

        let _ = Setting::find_by_name_or_create(
            conn,
            "THEME_PRIMARY_COLOR".to_string(),
            "rgb(85 64 198)".to_string(),
        );
        let _ = Setting::find_by_name_or_create(
            conn,
            "THEME_TERTIARY_COLOR".to_string(),
            "rgb(229 231 235)".to_string(),
        );
        let _ = Setting::find_by_name_or_create(
            conn,
            "THEME_WHITE_COLOR".to_string(),
            "rgb(255 255 255)".to_string(),
        );
        let _ = Setting::find_by_name_or_create(
            conn,
            "THEME_SECONDARY_COLOR".to_string(),
            "rgb(245 247 251)".to_string(),
        );
        let _ = Setting::find_by_name_or_create(
            conn,
            "THEME_DEFAULT_COLOR".to_string(),
            "rgb(32 33 36)".to_string(),
        );
        let _ = Setting::find_by_name_or_create(
            conn,
            "MAX_FRONTEND_LIMIT".to_string(),
            "2000".to_string(),
        );
        let _ = Setting::find_by_name_or_create(
            conn,
            "DOWNLOAD_ALLOWED".to_string(),
            "true".to_string(),
        );
        let _ =
            Setting::find_by_name_or_create(conn, "MAX_DOWNLOAD_LIMIT".to_string(), "".to_string());
        let _ =
            Setting::find_by_name_or_create(conn, "OPENAI_MODEL_NAME".to_string(), "".to_string());
        let _ = Setting::find_by_name_or_create(
            conn,
            "OPENAI_ENABLED".to_string(),
            "false".to_string(),
        );
        let _ = Setting::find_by_name_or_create(conn, "OPENAI_API_KEY".to_string(), "".to_string());
        let _ = Setting::find_by_name_or_create(
            conn,
            "USERS_CAN_OVERRIDE_GENAI_CONFIG".to_string(),
            "false".to_string(),
        );
        let _ =
            Setting::find_by_name_or_create(conn, "GLOBAL_OPENAI_KEY".to_string(), "".to_string());

        let _ = Setting::find_by_name_or_create(
            conn,
            "GOOGLE_LOGIN_ENABLED".to_string(),
            "".to_string(),
        );
        let _ =
            Setting::find_by_name_or_create(conn, "GOOGLE_CLIENT_KEY".to_string(), "".to_string());
        let _ = Setting::find_by_name_or_create(
            conn,
            "GOOGLE_CLIENT_SECRET".to_string(),
            "".to_string(),
        );
        let _ =
            Setting::find_by_name_or_create(conn, "SAML_LOGIN_ENABLED".to_string(), "".to_string());
        let _ = Setting::find_by_name_or_create(
            conn,
            "SAML_IDP_METADATA_XML".to_string(),
            "".to_string(),
        );
        let _ = Setting::find_by_name_or_create(conn, "SAML_ENTITY_ID".to_string(), "".to_string());
        Self::find_by_name_or_create(conn, "OPENAI_API_KEY".to_string(), "".to_string())?;
        Self::find_by_name_or_create(
            conn,
            "OPENAI_MODEL_NAME".to_string(),
            DEFAULT_OPENAI_MODEL_NAME.to_string(),
        )?;

        Self::find_by_name_or_create(
            conn,
            "OPENAI_API_URL".to_string(),
            DEFAULT_OPENAI_API_URL.to_string(),
        )?;

        Self::find_by_name_or_create(conn, "CLAUDE_API_KEY".to_string(), "".to_string())?;
        Self::find_by_name_or_create(
            conn,
            "CLAUDE_MODEL_NAME".to_string(),
            DEFAULT_CLAUDE_MODEL_NAME.to_string(),
        )?;

        Self::find_by_name_or_create(
            conn,
            "CLAUDE_API_URL".to_string(),
            DEFAULT_CLAUDE_API_URL.to_string(),
        )?;

        Self::find_by_name_or_create(conn, "OLLAMA_API_KEY".to_string(), "".to_string())?;
        Self::find_by_name_or_create(
            conn,
            "OLLAMA_MODEL_NAME".to_string(),
            DEFAULT_OLAMA_MODEL_NAME.to_string(),
        )?;

        Self::find_by_name_or_create(
            conn,
            "OLLAMA_API_URL".to_string(),
            DEFAULT_OLLAMA_API_URL.to_string(),
        )?;

        Self::find_by_name_or_create(
            conn,
            "GEN_AI_PROVIDER".to_string(),
            serde_json::to_string(&GenAIProvider::None).unwrap(),
        )?;

        let resp = generate_saml_keys();

        if let Ok((private_key, public_key)) = resp {
            let _ =
                Setting::find_by_name_or_create(conn, "SAML_PRIVATE_KEY".to_string(), private_key);

            let _ =
                Setting::find_by_name_or_create(conn, "SAML_PUBLIC_KEY".to_string(), public_key);
        }
        Ok(())
    }
    pub fn find_setting_by_name(conn: &mut PgConnection, name: String) -> Option<Self> {
        settings::table
            .filter(settings::name.eq(name))
            .first::<Self>(conn)
            .ok()
    }
    //find user settings by user id
    pub fn find_by_name(conn: &mut PgConnection, name: String) -> Option<String> {
        settings::table
            .filter(settings::name.eq(name))
            .select(settings::value)
            .first::<Option<String>>(conn)
            .ok()
            .and_then(|x| x)
    }

    pub fn find_by_names(conn: &mut PgConnection, names: Vec<String>) -> Result<Vec<Self>, Error> {
        settings::table
            .filter(settings::name.eq_any(names))
            .load(conn)
    }
    pub fn find_by_name_and_ensure(
        conn: &mut PgConnection,
        name: String,
        value: String,
    ) -> Result<Option<String>, Error> {
        let setting = Self::find_setting_by_name(conn, name.clone());

        let now = Utc::now().naive_utc();
        match setting {
            Some(setting) => {
                Self::update(
                    conn,
                    setting.id,
                    SettingChangeset {
                        name,
                        value: Some(value),
                        inserted_at: now,
                        updated_at: now,
                    },
                );
                Ok(Some("".to_owned()))
            }
            None => {
                Self::create(
                    conn,
                    SettingChangeset {
                        name,
                        value: Some(value),
                        inserted_at: now,
                        updated_at: now,
                    },
                );
                Ok(Some("".to_owned()))
            }
        }
    }
    pub fn find_by_name_or_create(
        conn: &mut PgConnection,
        name: String,
        value: String,
    ) -> Result<Option<String>, Error> {
        let setting = Self::find_by_name(conn, name.clone());
        match setting.clone() {
            Some(_) => Ok(setting),
            None => {
                let now = Utc::now().naive_utc();
                Self::create(
                    conn,
                    SettingChangeset {
                        name,
                        value: Some(value),
                        inserted_at: now,
                        updated_at: now,
                    },
                );
                Ok(Some("".to_string()))
            }
        }
    }
}
