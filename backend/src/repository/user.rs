use std::collections::HashMap;

use super::models::{
    Organization, PermissionSet, User, UserChangeset, UserPermissionSet,
    UserPermissionSetChangeset, UserSetting, UserSettingChangeset,
};
use super::permissions::PermissionNames;
use super::schema::{user_teams, users};

use chrono::Utc;
use diesel::result::Error;
use diesel::NullableExpressionMethods;

use diesel::prelude::*;

use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};
use sha2::{Digest, Sha256};

#[derive(AsChangeset)]
#[diesel(table_name = users)]
pub struct UserActivationChangeset {
    is_deactivated: bool,
}

impl User {
    pub fn system_user(conn: &mut PgConnection) -> Result<Self, Error> {
        users::table
            .filter(users::email.eq("AG::System"))
            .first(conn)
    }
    pub fn search(conn: &mut PgConnection, q: String) -> Result<Vec<Self>, Error> {
        users::table
            .filter(
                users::email
                    .ilike(format!("%{}%", q))
                    .or(users::first_name.ilike(format!("%{}%", q)))
                    .or(users::last_name.ilike(format!("%{}%", q))),
            )
            .order(users::email.asc())
            .select(users::all_columns)
            .load::<Self>(conn)
    }
    pub fn find_by_ids(conn: &mut PgConnection, ids: Vec<i64>) -> Result<Vec<Self>, Error> {
        users::table
            .filter(users::id.eq_any(ids))
            .load::<Self>(conn)
    }
    pub fn sorted_index(conn: &mut PgConnection) -> Result<Vec<Self>, Error> {
        users::table.order(users::email.asc()).load::<Self>(conn)
    }
    pub fn find_by_email(conn: &mut PgConnection, em: String) -> Result<Self, Error> {
        users::table.filter(users::email.eq(em)).first(conn)
    }

    pub fn create_or_update(
        conn: &mut PgConnection,
        updated_model: UserChangeset,
    ) -> Result<Self, Error> {
        let user = match updated_model.email.clone() {
            Some(em) => match Self::find_by_email(conn, em) {
                Ok(record) => Self::update(conn, record.id, updated_model),
                _ => Self::create(conn, updated_model),
            },
            None => Err(Error::NotFound),
        }?;
        UserSetting::create_defaults(conn, user.id)?;
        Ok(user)
    }

    pub fn fetch_permissions(&self, conn: &mut PgConnection) -> Vec<PermissionNames> {
        UserPermissionSet::fetch_permissions_by_user_id(conn, self.id)
    }

    pub fn fetch_permission_sets(&self, conn: &mut PgConnection) -> Vec<i64> {
        UserPermissionSet::fetch_permission_sets_by_user_id(conn, self.id)
    }
    pub fn deactivate(conn: &mut PgConnection, uid: i64) -> Result<Self, Error> {
        let updated_model = UserActivationChangeset {
            is_deactivated: true,
        };

        Self::update_activation(conn, uid, updated_model)
    }

    pub fn activate(conn: &mut PgConnection, uid: i64) -> Result<Self, Error> {
        let updated_model = UserActivationChangeset {
            is_deactivated: false,
        };

        Self::update_activation(conn, uid, updated_model)
    }

    pub fn update_activation(
        conn: &mut PgConnection,
        uid: i64,
        updated_model: UserActivationChangeset,
    ) -> Result<Self, Error> {
        diesel::update(users::table.find(uid))
            .set(updated_model)
            .get_result(conn)
    }

    pub fn find_by_team_id(conn: &mut PgConnection, tid: i64) -> Result<Vec<Self>, Error> {
        users::table
            .inner_join(user_teams::table.on(users::id.nullable().eq(user_teams::user_id)))
            .filter(user_teams::team_id.eq(tid))
            .order(users::email.asc())
            .select(users::all_columns)
            .load::<Self>(conn)
    }
    pub fn create_bulk(
        conn: &mut PgConnection,
        emails: Vec<String>,
        ps_id: i64,
    ) -> Result<Vec<Result<Self, Error>>, Error> {
        PermissionSet::find(conn, ps_id)?;

        let allowed_orgs_with_ids = Organization::all_allowed_domains(conn)?;
        let allowed_orgs = allowed_orgs_with_ids
            .iter()
            .map(|o| o.0.clone())
            .collect::<String>();
        let mut allowed_org_map: HashMap<String, i64> = HashMap::new();

        for org in allowed_orgs_with_ids.iter() {
            allowed_org_map.insert(org.0.clone(), org.1);
        }

        Ok(emails
            .iter()
            .filter(|em| allowed_orgs.contains(Self::find_domain(em).as_str()))
            .map(|em| match Self::find_by_email(conn, em.clone()) {
                Ok(record) => return Ok(record),
                _ => {
                    let domain = Self::find_domain(em.as_str());
                    let org_id = allowed_org_map.get(domain.as_str());
                    let user = Self::create(
                        conn,
                        UserChangeset {
                            email: Some(em.clone()),

                            is_deactivated: Some(false),
                            inserted_at: Utc::now().naive_utc(),
                            updated_at: Utc::now().naive_utc(),
                            first_name: None,
                            last_name: None,
                            full_name: None,
                            profile_pic: None,
                            metadata: None,
                            organization_id: Some(org_id.unwrap_or(&0i64).clone()),
                            password: None,
                        },
                    )?;

                    UserPermissionSet::create(
                        conn,
                        UserPermissionSetChangeset {
                            user_id: Some(user.id),
                            permission_set_id: Some(ps_id),
                            inserted_at: Utc::now().naive_utc(),
                            updated_at: Utc::now().naive_utc(),
                        },
                    )?;

                    Ok(user)
                }
            })
            .collect::<Vec<Result<Self, Error>>>())
    }

    pub fn encryt_password(password: String) -> String {
        let mut hasher = Sha256::new();
        Digest::update(&mut hasher, password);
        let result = hasher.finalize();
        format!("{:x}", result)
    }

    // find domain from email return String
    pub fn find_domain(email: &str) -> String {
        let mut domain = email.split("@").collect::<Vec<&str>>();
        let domain = domain.pop().unwrap().to_string();
        domain
    }
}
