use chrono::Utc;
use diesel::{r2d2::ConnectionManager, PgConnection};

use dotenv::dotenv;

use crate::repository::{
    models::{PermissionSet, User, UserChangeset, UserPermissionSet, UserPermissionSetChangeset},
    DBPool,
};

pub fn create_default_users(pool: DBPool) {
    let mut conn = pool.get();
    let now = Utc::now().naive_utc();
    let admin_permission_set_id = PermissionSet::admin(&mut conn.unwrap()).unwrap().id;
    let mut conn = pool.get();
    let viewer_permission_set_id = PermissionSet::viewer(&mut conn.unwrap()).unwrap().id;
    let mut conn = pool.get();

    let user = UserChangeset {
        first_name: Some("AG ".to_string()),
        last_name: Some("Admin".to_string()),
        email: Some("admin@emample.com".to_string()),
        full_name: Some("AG Admin".to_string()),
        profile_pic: None,
        metadata: None,
        inserted_at: now,
        updated_at: now,
        is_deactivated: None,
        organization_id: None,
        password: Some(User::encryt_password("ag_admin_password".to_string())),
    };

    let admin = User::create_or_update(&mut conn.unwrap(), user).unwrap();
    let mut conn = pool.get();
    let _ = UserPermissionSet::create_or_update_for_user(
        &mut conn.unwrap(),
        admin.id,
        admin_permission_set_id,
    );
    let mut conn = pool.get();
    let user = UserChangeset {
        first_name: Some("AG ".to_string()),
        last_name: Some("Viewer".to_string()),
        email: Some("viewer@emample.com".to_string()),
        full_name: Some("AG Viewer".to_string()),
        profile_pic: None,
        metadata: None,
        inserted_at: now,
        updated_at: now,
        is_deactivated: None,
        organization_id: None,
        password: Some(User::encryt_password("ag_viewer_password".to_string())),
    };

    let viewer = User::create_or_update(&mut conn.unwrap(), user).unwrap();
    let mut conn = pool.get();
    let _ = UserPermissionSet::create_or_update_for_user(
        &mut conn.unwrap(),
        viewer.id,
        viewer_permission_set_id,
    );

    let mut conn = pool.get();
    let user = UserChangeset {
        first_name: Some("AG ".to_string()),
        last_name: Some("System".to_string()),
        email: Some("AG::System".to_string()),
        full_name: Some("AG::System".to_string()),
        profile_pic: None,
        metadata: None,
        inserted_at: now,
        updated_at: now,
        is_deactivated: None,
        organization_id: None,
        password: None,
    };

    let system = User::create_or_update(&mut conn.unwrap(), user).unwrap();
    let mut conn = pool.get();
    let _ = UserPermissionSet::create_or_update_for_user(
        &mut conn.unwrap(),
        system.id,
        admin_permission_set_id,
    );
    dotenv().ok();
    let admin_email = std::env::var("AG_ADMIN_EMAIL");
    match admin_email {
        Ok(email) => {
            let mut conn = pool.get();
            let user = UserChangeset {
                first_name: None,
                last_name: None,
                email: Some(email),
                full_name: None,
                profile_pic: None,
                metadata: None,
                inserted_at: now,
                updated_at: now,
                is_deactivated: None,
                organization_id: None,
                password: None,
            };
            let admin = User::create_or_update(&mut conn.unwrap(), user).unwrap();

            let mut conn = pool.get();
            let _ = UserPermissionSet::create_or_update_for_user(
                &mut conn.unwrap(),
                admin.id,
                admin_permission_set_id,
            );
        }
        Err(_) => {}
    }
}
