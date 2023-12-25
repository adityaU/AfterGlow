use chrono::Utc;


use dotenv::dotenv;

use crate::{
    app::settings::reports::REPORT_CONFIG_NAMES,
    repository::{
        models::{
            PermissionSet, Setting, User, UserChangeset, UserPermissionSet,
        },
        DBPool,
    },
};

pub fn create_default_settings(pool: DBPool) {
    for setting in REPORT_CONFIG_NAMES {
        let conn = pool.get();
        let _ = Setting::find_by_name_or_create(
            &mut conn.unwrap(),
            setting.to_string(),
            "".to_string(),
        );
    }

    let conn = pool.get();
   let _ =  Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "THEME_PRIMARY_COLOR".to_string(),
        "rgb(85 64 198)".to_string(),
    );
    let conn = pool.get();
   let _ =  Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "THEME_TERTIARY_COLOR".to_string(),
        "rgb(229 231 235)".to_string(),
    );
    let conn = pool.get();
   let _ =  Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "THEME_WHITE_COLOR".to_string(),
        "rgb(255 255 255)".to_string(),
    );
    let conn = pool.get();
 let _ =    Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "THEME_SECONDARY_COLOR".to_string(),
        "rgb(245 247 251)".to_string(),
    );
    let conn = pool.get();
  let _ =   Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "THEME_DEFAULT_COLOR".to_string(),
        "rgb(32 33 36)".to_string(),
    );
    let conn = pool.get();
   let _ =  Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "MAX_FRONTEND_LIMIT".to_string(),
        "2000".to_string(),
    );
    let conn = pool.get();
  let _ =   Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "DOWNLOAD_ALLOWED".to_string(),
        "true".to_string(),
    );
    let conn = pool.get();
   let _ =  Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "MAX_DOWNLOAD_LIMIT".to_string(),
        "".to_string(),
    );
    let conn = pool.get();
  let _ =   Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "OPENAI_MODEL_NAME".to_string(),
        "".to_string(),
    );
    let conn = pool.get();
    let _ = Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "OPENAI_ENABLED".to_string(),
        "false".to_string(),
    );
    let conn = pool.get();
    let _ = Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "OPENAI_API_KEY".to_string(),
        "".to_string(),
    );
    let conn = pool.get();
    let _ = Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "USERS_CAN_OVERRIDE_OPENAI_KEY ".to_string(),
        "false".to_string(),
    );
    let conn = pool.get();
   let _ =  Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "GLOBAL_OPENAI_KEY".to_string(),
        "".to_string(),
    );
}

pub fn create_default_users(pool: DBPool) {
    let conn = pool.get();
    let now = Utc::now().naive_utc();
    let admin_permission_set_id = PermissionSet::admin(&mut conn.unwrap()).unwrap().id;
    let conn = pool.get();
    let viewer_permission_set_id = PermissionSet::viewer(&mut conn.unwrap()).unwrap().id;
    let conn = pool.get();

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
        Err(_) => {}
    }
}
