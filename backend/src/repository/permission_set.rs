use super::models::{PermissionSet, PermissionSetChangeset};
use super::schema::{permission_sets, user_permission_sets};

use chrono::Utc;
use diesel::prelude::*;

use diesel::result::Error;
use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};

impl PermissionSet {
    pub fn find_by_user_id(conn: &mut PgConnection, uid: i64) -> Result<Vec<Self>, Error> {
        permission_sets::table
            .inner_join(
                user_permission_sets::table.on(permission_sets::id
                    .nullable()
                    .eq(user_permission_sets::permission_set_id)),
            )
            .filter(user_permission_sets::user_id.eq(uid))
            .select(permission_sets::all_columns)
            .load::<Self>(conn)
    }

    pub fn find_or_create(conn: &mut PgConnection, name: &str) -> Result<Self, Error> {
        let now = Utc::now().naive_utc();
        let permission_set = permission_sets::table
            .filter(permission_sets::name.eq(name))
            .first::<Self>(conn);
        match permission_set {
            Ok(permission_set) => Ok(permission_set),
            Err(_) => Self::create(
                conn,
                PermissionSetChangeset {
                    name: Some(name.to_string()),
                    inserted_at: now,
                    updated_at: now,
                },
            ),
        }
    }

    pub fn admin(conn: &mut PgConnection) -> Result<Self, Error> {
        permission_sets::table
            .filter(permission_sets::name.eq("Admin"))
            .first::<Self>(conn)
    }
    pub fn viewer(conn: &mut PgConnection) -> Result<Self, Error> {
        permission_sets::table
            .filter(permission_sets::name.eq("Viewer"))
            .first::<Self>(conn)
    }
    pub fn editor(conn: &mut PgConnection) -> Result<Self, Error> {
        permission_sets::table
            .filter(permission_sets::name.eq("Editor"))
            .first::<Self>(conn)
    }
}
