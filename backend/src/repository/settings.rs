use chrono::Utc;
use diesel::PgConnection;

use super::models::SettingChangeset;
use super::{models::Setting, schema::settings};
use diesel::result::Error;

use diesel::{expression_methods::ExpressionMethods, QueryDsl, RunQueryDsl};

impl Setting {
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
