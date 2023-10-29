use diesel::PgConnection;

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
}
