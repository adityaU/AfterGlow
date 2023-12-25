use super::models::Organization;
use super::schema::organizations::dsl::*;

use diesel::result::Error;
use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};

impl Organization {
    pub fn active_count(conn: &mut PgConnection) -> Result<i64, Error> {
        organizations
            .filter(is_deactivated.eq(false))
            .count()
            .get_result(conn)
    }
    pub fn sorted_index(conn: &mut PgConnection) -> Result<Vec<Self>, Error> {
        organizations.order(google_domain.asc()).load::<Self>(conn)
    }
    pub fn find_by_domain(conn: &mut PgConnection, dm: &str) -> Result<Self, Error> {
        organizations.filter(google_domain.eq(dm)).first(conn)
    }

    pub fn all_allowed_domains(conn: &mut PgConnection) -> Result<Vec<(String, i64)>, Error> {
        Ok(Self::index(conn)?
            .iter()
            .filter(|org| !org.is_deactivated)
            .map(|org| (org.google_domain.clone(), org.id))
            .collect::<Vec<(String, i64)>>())
    }
}
