use chrono::Utc;
use diesel::PgConnection;

use diesel::prelude::*;

use crate::app::settings::gen_ai::GenAIProvider;
use crate::app::settings::gen_ai::DEFAULT_CLAUDE_API_URL;
use crate::app::settings::gen_ai::DEFAULT_CLAUDE_MODEL_NAME;
use crate::app::settings::gen_ai::DEFAULT_OLAMA_MODEL_NAME;
use crate::app::settings::gen_ai::DEFAULT_OLLAMA_API_URL;
use crate::app::settings::gen_ai::DEFAULT_OPENAI_API_URL;
use crate::app::settings::gen_ai::DEFAULT_OPENAI_MODEL_NAME;

use super::models::{SettingsTypes, UserSettingChangeset};
use super::{models::UserSetting, schema::user_settings};
use diesel::result::Error;

use diesel::{expression_methods::ExpressionMethods, QueryDsl, RunQueryDsl};

impl UserSetting {
    fn get_default_changeset(user_id: i64, name: &str, value: &str) -> UserSettingChangeset {
        let now = Utc::now().naive_utc();
        UserSettingChangeset {
            name: name.into(),
            value: Some(value.into()),
            setting_type: SettingsTypes::General,
            user_id,
            api_action_id: None,
            inserted_at: now,
            updated_at: now,
        }
    }
    pub fn create_defaults(conn: &mut PgConnection, user_id: i64) -> Result<(), Error> {
        let _now = Utc::now().naive_utc();
        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(user_id, "DOWNLOAD_ALLOWED", "true"),
        )?;
        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(user_id, "MAX_FRONTEND_LIMIT", "2000"),
        )?;

        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(user_id, "OPENAI_API_KEY", ""),
        )?;
        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(user_id, "OPENAI_MODEL_NAME", DEFAULT_OPENAI_MODEL_NAME),
        )?;

        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(user_id, "OPENAI_API_URL", DEFAULT_OPENAI_API_URL),
        )?;

        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(user_id, "CLAUDE_API_KEY", ""),
        )?;
        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(user_id, "CLAUDE_MODEL_NAME", DEFAULT_CLAUDE_MODEL_NAME),
        )?;

        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(user_id, "CLAUDE_API_URL", DEFAULT_CLAUDE_API_URL),
        )?;

        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(user_id, "OLLAMA_API_KEY", ""),
        )?;
        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(user_id, "OLLAMA_MODEL_NAME", DEFAULT_OLAMA_MODEL_NAME),
        )?;

        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(user_id, "OLLAMA_API_URL", DEFAULT_OLLAMA_API_URL),
        )?;

        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(
                user_id,
                "GEN_AI_PROVIDER",
                serde_json::to_string(&GenAIProvider::None)
                    .unwrap()
                    .as_str(),
            ),
        )?;
        Ok(())
    }

    pub fn create_if_does_not_exist(
        conn: &mut PgConnection,
        changeset: UserSettingChangeset,
    ) -> Result<(), Error> {
        match user_settings::table
            .filter(user_settings::user_id.eq(changeset.user_id))
            .filter(user_settings::name.eq(changeset.name.clone()))
            .first::<Self>(conn)
            .ok()
        {
            Some(_) => Ok(()),
            None => {
                let _ = Self::create(conn, changeset)?;
                Ok(())
            }
        }
    }

    pub fn find_by_names(
        conn: &mut PgConnection,
        names: Vec<String>,
        user_id: i64,
    ) -> Result<Vec<Self>, Error> {
        user_settings::table
            .filter(
                user_settings::name
                    .eq_any(names)
                    .and(user_settings::user_id.eq(user_id)),
            )
            .load::<Self>(conn)
    }
    //find user settings by user id
    pub fn find_by_user_id(conn: &mut PgConnection, uid: i64) -> Result<Vec<Self>, Error> {
        user_settings::table
            .filter(user_settings::user_id.eq(uid))
            .load::<Self>(conn)
    }

    pub fn find_by_user_id_and_name(
        conn: &mut PgConnection,
        uid: i64,
        name: String,
    ) -> Option<String> {
        user_settings::table
            .filter(user_settings::user_id.eq(uid))
            .filter(user_settings::name.eq(name))
            .select(user_settings::value)
            .first::<Option<String>>(conn)
            .ok()
            .unwrap_or(None)

        // match us {
        //     Some(x) => match x?.parse::<i64>() {
        //         Ok(x) => Some(x),
        //         Err(_) => None,
        //     },
        //     None => None,
        // }
    }
}
