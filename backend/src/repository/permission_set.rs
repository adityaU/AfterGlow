use super::models::PermissionSet;
use super::schema::{permission_sets, user_permission_sets};

use diesel::prelude::*;

use diesel::result::Error;
use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};

impl PermissionSet {
    pub fn find_by_user_id(conn: &mut PgConnection, uid: i32) -> Result<Vec<Self>, Error> {
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
