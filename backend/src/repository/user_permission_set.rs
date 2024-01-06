use super::models::UserPermissionSet;
use super::models::UserPermissionSetChangeset;
use super::permissions::PermissionNames;
use super::schema::permission_sets;
use super::schema::permissions;
use super::schema::user_permission_sets;
use chrono::Utc;
use diesel::prelude::*;

use diesel::result::Error;
use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};

impl UserPermissionSet {
    pub fn find_by_user_id(conn: &mut PgConnection, uid: i64) -> Result<Self, Error> {
        user_permission_sets::table
            .filter(user_permission_sets::user_id.eq(uid))
            .first(conn)
    }

    pub fn create_or_update_for_user(
        conn: &mut PgConnection,
        uid: i64,
        permission_set_id: i64,
    ) -> Result<Self, Error> {
        let updated_model = UserPermissionSetChangeset {
            user_id: Some(uid),
            permission_set_id: Some(permission_set_id),
            inserted_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
        };
        match Self::find_by_user_id(conn, uid) {
            Ok(record) => Self::update(conn, record.id, updated_model),
            _ => Self::create(conn, updated_model),
        }
    }

    pub fn fetch_permission_sets_by_user_id(conn: &mut PgConnection, uid: i64) -> Vec<i64> {
        user_permission_sets::table
            .filter(user_permission_sets::user_id.eq(uid))
            .inner_join(permission_sets::table)
            .select(permission_sets::id)
            .load::<i64>(conn)
            .ok()
            .unwrap_or(vec![])

        // convert permissions to Vec<String>
    }

    pub fn fetch_permissions_by_user_id(conn: &mut PgConnection, uid: i64) -> Vec<PermissionNames> {
        user_permission_sets::table
            .filter(user_permission_sets::user_id.eq(uid))
            .inner_join(permission_sets::table)
            .inner_join(
                permissions::table.on(permission_sets::id
                    .nullable()
                    .eq(permissions::permission_set_id)),
            )
            .select(permissions::name)
            .load::<Option<PermissionNames>>(conn)
            .ok()
            .unwrap_or(vec![None])
            .into_iter()
            .filter_map(|opt_str: Option<PermissionNames>| opt_str)
            .collect()
    }
}
