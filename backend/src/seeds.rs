use chrono::Utc;

use dotenv::dotenv;

use serde_json::json;

use uuid::Uuid;

use crate::repository::models::{
    Database as DBModel, DatabaseChangeset, Organization, OrganizationSetting, SupportedDatabases,
    UserSetting,
};
use crate::repository::permissions::{EDITOR_PERMISSIONS, VIEWER_PERMISSIONS};

use crate::repository::{
    models::{Permission, PermissionSet, Setting, User, UserChangeset, UserPermissionSet},
    permissions::ADMIN_PERMISSIONS,
    DBPool,
};

pub fn ensure_user_settings(pool: DBPool) {
    let conn = pool.get();
    let orgs = Organization::index(&mut conn.unwrap());
    if orgs.is_err() {
        return;
    }
    let orgs = orgs.unwrap();
    orgs.iter().for_each(|org| {
        let conn = pool.get();
        OrganizationSetting::create_defaults(&mut conn.unwrap(), org.id);
    });
}

pub fn ensure_organization_settings(pool: DBPool) {
    let conn = pool.get();
    let users = User::index(&mut conn.unwrap());
    if users.is_err() {
        println!("Not able to fetch organizations");
        return;
    }
    let users = users.unwrap();
    users.iter().for_each(|user| {
        let conn = pool.get();
        UserSetting::create_defaults(&mut conn.unwrap(), user.id);
    });
}

pub fn setup_google_credentials(pool: DBPool) {
    dotenv().ok();
    let google_client_id = std::env::var("AG_GOOGLE_CLIENT_ID");
    let google_client_secret = std::env::var("AG_GOOGLE_CLIENT_SECRET");
    match (google_client_id, google_client_secret) {
        (Ok(client_id), Ok(client_secret)) => {
            let conn = pool.get();
            let _ = Setting::find_by_name_and_ensure(
                &mut conn.unwrap(),
                "GOOGLE_LOGIN_ENABLED".to_string(),
                "true".to_string(),
            );
            let conn = pool.get();
            let _ = Setting::find_by_name_and_ensure(
                &mut conn.unwrap(),
                "GOOGLE_CLIENT_KEY".to_string(),
                client_id,
            );
            let conn = pool.get();
            let _ = Setting::find_by_name_and_ensure(
                &mut conn.unwrap(),
                "GOOGLE_CLIENT_SECRET".to_string(),
                client_secret,
            );
        }
        _ => (),
    }
}

pub fn create_default_settings(pool: DBPool) {
    let conn = pool.get();
    Setting::create_defaults(&mut conn.unwrap());
}

pub fn create_default_users(pool: DBPool) {
    create_default_permissions(pool.clone());
    let conn = pool.get();
    let now = Utc::now().naive_utc();
    // println!("conn {:?}", &conn);
    let admin_permission_set_id = PermissionSet::admin(&mut conn.unwrap()).unwrap().id;
    let conn = pool.get();
    let viewer_permission_set_id = PermissionSet::viewer(&mut conn.unwrap()).unwrap().id;
    let conn = pool.get();

    let user = UserChangeset {
        first_name: Some("AG ".to_string()),
        last_name: Some("Admin".to_string()),
        email: Some("admin@example.com".to_string()),
        full_name: Some("AG Admin".to_string()),
        profile_pic: None,
        metadata: None,
        inserted_at: now,
        updated_at: now,
        is_deactivated: None,
        organization_id: None,
        password: Some(User::encrypt_password("ag_admin_password".to_string())),
    };

    let admin = User::create_or_update(&mut conn.unwrap(), user).unwrap();
    let conn = pool.get();
    let _ = UserPermissionSet::create_or_update_for_user(
        &mut conn.unwrap(),
        admin.id,
        admin_permission_set_id,
    );
    let conn = pool.get();
    let user = UserChangeset {
        first_name: Some("AG ".to_string()),
        last_name: Some("Viewer".to_string()),
        email: Some("viewer@example.com".to_string()),
        full_name: Some("AG Viewer".to_string()),
        profile_pic: None,
        metadata: None,
        inserted_at: now,
        updated_at: now,
        is_deactivated: None,
        organization_id: None,
        password: Some(User::encrypt_password("ag_viewer_password".to_string())),
    };

    let viewer = User::create_or_update(&mut conn.unwrap(), user).unwrap();
    let conn = pool.get();
    let _ = UserPermissionSet::create_or_update_for_user(
        &mut conn.unwrap(),
        viewer.id,
        viewer_permission_set_id,
    );

    let conn = pool.get();
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
    let conn = pool.get();
    let _ = UserPermissionSet::create_or_update_for_user(
        &mut conn.unwrap(),
        system.id,
        admin_permission_set_id,
    );
    dotenv().ok();
    let admin_email = std::env::var("AG_ADMIN_EMAIL");
    match admin_email {
        Ok(email) => {
            let conn = pool.get();
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

            let conn = pool.get();
            let _ = UserPermissionSet::create_or_update_for_user(
                &mut conn.unwrap(),
                admin.id,
                admin_permission_set_id,
            );
        }
        Err(_) => (),
    }
}

pub fn create_default_permissions(pool: DBPool) {
    let conn = pool.get();
    let admin = PermissionSet::find_or_create(&mut conn.unwrap(), "Admin").unwrap();
    ADMIN_PERMISSIONS.iter().for_each(|permission| {
        let conn = pool.get();
        let _ = Permission::find_or_create(&mut conn.unwrap(), permission, admin.id);
    });
    let conn = pool.get();
    let editor = PermissionSet::find_or_create(&mut conn.unwrap(), "Editor").unwrap();
    EDITOR_PERMISSIONS.iter().for_each(|permission| {
        let conn = pool.get();
        let _ = Permission::find_or_create(&mut conn.unwrap(), permission, editor.id);
    });
    let conn = pool.get();
    let viewer = PermissionSet::find_or_create(&mut conn.unwrap(), "Viewer").unwrap();
    VIEWER_PERMISSIONS.iter().for_each(|permission| {
        let conn = pool.get();
        let _ = Permission::find_or_create(&mut conn.unwrap(), permission, viewer.id);
    });
}

pub fn create_default_api_client(pool: DBPool) {
    let conn = pool.get();
    let gac = DBModel::find_by_name(&mut conn.unwrap(), "Generic API Client");
    match gac {
        Err(_) => {
            let conn = pool.get();
            DBModel::create(
                &mut conn.unwrap(),
                DatabaseChangeset {
                    name: Some("Generic API Client".to_string()),
                    db_type: Some(SupportedDatabases::ApiClient),
                    config: Some(json!({})),
                    inserted_at: Utc::now().naive_utc(),
                    updated_at: Utc::now().naive_utc(),
                    last_accessed_at: Some(Utc::now().naive_utc()),
                    unique_identifier: Some(Uuid::new_v4()),
                },
            );
        }
        Ok(_) => (),
    }
}
