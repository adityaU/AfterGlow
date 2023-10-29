use diesel::PgConnection;

use super::{models::UserSetting, schema::user_settings};
use diesel::result::Error;

use diesel::{expression_methods::ExpressionMethods, QueryDsl, RunQueryDsl};

impl UserSetting {
    //find user settings by user id
    pub fn find_by_user_id(conn: &mut PgConnection, uid: i32) -> Result<Vec<Self>, Error> {
        let uid = uid as i64;

        user_settings::table
            .filter(user_settings::user_id.eq(uid))
            .load::<Self>(conn)
    }

    pub fn find_by_user_id_and_name(
        conn: &mut PgConnection,
        uid: i32,
        name: String,
    ) -> Option<String> {
        let uid = uid as i64;
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
