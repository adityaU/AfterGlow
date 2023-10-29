use super::models::OrganizationSetting;
use super::schema::organization_settings;
use super::schema::users::organization_id;

use diesel::dsl::sql;

use diesel::result::Error;
use diesel::sql_types::{Nullable, Text};
use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};

impl OrganizationSetting {
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
}
