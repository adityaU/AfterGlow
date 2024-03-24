use chrono::Utc;
use diesel::PgConnection;

use super::models::{SettingsTypes, UserSettingChangeset};
use super::{models::UserSetting, schema::user_settings};
use diesel::result::Error;

use diesel::{expression_methods::ExpressionMethods, QueryDsl, RunQueryDsl};

impl UserSetting {
    pub fn create_defaults(conn: &mut PgConnection, user_id: i64) -> Result<(), Error> {
        let now = Utc::now().naive_utc();
        Self::create_if_does_not_exist(
            conn,
            UserSettingChangeset {
                name: "DOWNLOAD_ALLOWED".into(),
                value: Some("true".into()),
                setting_type: SettingsTypes::General,
                user_id,
                api_action_id: None,
                inserted_at: now,
                updated_at: now,
            },
        )?;
        Self::create_if_does_not_exist(
            conn,
            UserSettingChangeset {
                name: "MAX_DOWNLOAD_LIMIT".into(),
                value: Some("true".into()),
                setting_type: SettingsTypes::General,
                user_id,
                api_action_id: None,
                inserted_at: now,
                updated_at: now,
            },
        )?;
        Self::create_if_does_not_exist(
            conn,
            UserSettingChangeset {
                name: "OPENAI_API_KEY".into(),
                value: Some("true".into()),
                setting_type: SettingsTypes::General,
                user_id,
                api_action_id: None,
                inserted_at: now,
                updated_at: now,
            },
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
