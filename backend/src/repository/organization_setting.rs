use crate::app::settings::gen_ai::{
    GenAIProvider, DEFAULT_CLAUDE_API_URL, DEFAULT_CLAUDE_MODEL_NAME, DEFAULT_OLAMA_MODEL_NAME,
    DEFAULT_OLLAMA_API_URL, DEFAULT_OPENAI_API_URL, DEFAULT_OPENAI_MODEL_NAME,
};

use super::models::{OrganizationSetting, OrganizationSettingChangeset, SettingsTypes};
use super::schema::organization_settings;

use chrono::Utc;
use diesel::result::Error;

use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};

use diesel::prelude::*;

impl OrganizationSetting {
    pub fn find_by_names(
        conn: &mut PgConnection,
        names: Vec<String>,
        org_id: i64,
    ) -> Result<Vec<Self>, Error> {
        organization_settings::table
            .filter(
                organization_settings::name
                    .eq_any(names)
                    .and(organization_settings::organization_id.eq(org_id)),
            )
            .load::<Self>(conn)
    }
    pub fn find_by_org_id(conn: &mut PgConnection, oid: i64) -> Result<Vec<Self>, Error> {
        organization_settings::table
            .filter(organization_settings::organization_id.eq(oid))
            .get_results(conn)
    }

    pub fn find_by_org_id_and_name(
        conn: &mut PgConnection,
        oid: i64,
        name: String,
    ) -> Option<String> {
        organization_settings::table
            .filter(organization_settings::organization_id.eq(oid))
            .filter(organization_settings::name.eq(name))
            .select(organization_settings::value)
            .first::<Option<String>>(conn)
            .ok()
            .and_then(|x| x)
    }

    fn get_default_changeset(org_id: i64, name: &str, value: &str) -> OrganizationSettingChangeset {
        let now = Utc::now().naive_utc();
        OrganizationSettingChangeset {
            name: name.into(),
            value: Some(value.into()),
            setting_type: SettingsTypes::General,
            organization_id: org_id,
            api_action_id: None,
            inserted_at: now,
            updated_at: now,
        }
    }

    pub fn create_defaults(conn: &mut PgConnection, org_id: i64) -> Result<(), Error> {
        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(org_id, "MAX_DOWNLOAD_LIMIT", "2000"),
        )?;
        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(org_id, "DOWNLOAD_ALLOWED", "true"),
        )?;
        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(org_id, "MAX_FRONTEND_LIMIT", ""),
        )?;
        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(org_id, "OPENAI_API_KEY", ""),
        )?;
        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(org_id, "OPENAI_MODEL_NAME", DEFAULT_OPENAI_MODEL_NAME),
        )?;

        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(org_id, "OPENAI_API_URL", DEFAULT_OPENAI_API_URL),
        )?;

        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(org_id, "CLAUDE_API_KEY", ""),
        )?;
        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(org_id, "CLAUDE_MODEL_NAME", DEFAULT_CLAUDE_MODEL_NAME),
        )?;

        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(org_id, "CLAUDE_API_URL", DEFAULT_CLAUDE_API_URL),
        )?;

        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(org_id, "OLLAMA_API_KEY", ""),
        )?;
        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(org_id, "OLLAMA_MODEL_NAME", DEFAULT_OLAMA_MODEL_NAME),
        )?;

        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(org_id, "OLLAMA_API_URL", DEFAULT_OLLAMA_API_URL),
        )?;
        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(org_id, "USERS_CAN_OVERRIDE_GENAI_CONFIG", "false"),
        )?;

        Self::create_if_does_not_exist(
            conn,
            Self::get_default_changeset(
                org_id,
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
        changeset: OrganizationSettingChangeset,
    ) -> Result<(), Error> {
        match organization_settings::table
            .filter(organization_settings::organization_id.eq(changeset.organization_id))
            .filter(organization_settings::name.eq(changeset.name.clone()))
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
}
