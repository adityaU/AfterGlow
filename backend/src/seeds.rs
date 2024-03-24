use chrono::Utc;

use dotenv::dotenv;


use rand::rngs::OsRng;
use rcgen::{Certificate, CertificateParams, KeyPair};
use rsa::pkcs8::{EncodePrivateKey, LineEnding};
use rsa::RsaPrivateKey;

use crate::{
    app::settings::reports::REPORT_CONFIG_NAMES,
    repository::{
        models::{Permission, PermissionSet, Setting, User, UserChangeset, UserPermissionSet},
        permissions::{ADMIN_PERMISSIONS},
        DBPool,
    },
};

pub fn setup_google_credentials(pool: DBPool) {
    dotenv().ok();
    let google_client_id = std::env::var("AG_GOOGLE_CLIENT_ID");
    let google_client_secret = std::env::var("AG_GOOGLE_CLIENT_SECRET");
    println!("Google client id: {:?}", google_client_id);
    println!("Google client secret: {:?}", google_client_secret);
    match (google_client_id, google_client_secret) {
        (Ok(client_id), Ok(client_secret)) => {
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
    for setting in REPORT_CONFIG_NAMES {
        let conn = pool.get();
        let _ = Setting::find_by_name_or_create(
            &mut conn.unwrap(),
            setting.to_string(),
            "".to_string(),
        );
    }

    let conn = pool.get();
    let _ = Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "THEME_PRIMARY_COLOR".to_string(),
        "rgb(85 64 198)".to_string(),
    );
    let conn = pool.get();
    let _ = Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "THEME_TERTIARY_COLOR".to_string(),
        "rgb(229 231 235)".to_string(),
    );
    let conn = pool.get();
    let _ = Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "THEME_WHITE_COLOR".to_string(),
        "rgb(255 255 255)".to_string(),
    );
    let conn = pool.get();
    let _ = Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "THEME_SECONDARY_COLOR".to_string(),
        "rgb(245 247 251)".to_string(),
    );
    let conn = pool.get();
    let _ = Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "THEME_DEFAULT_COLOR".to_string(),
        "rgb(32 33 36)".to_string(),
    );
    let conn = pool.get();
    let _ = Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "MAX_FRONTEND_LIMIT".to_string(),
        "2000".to_string(),
    );
    let conn = pool.get();
    let _ = Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "DOWNLOAD_ALLOWED".to_string(),
        "true".to_string(),
    );
    let conn = pool.get();
    let _ = Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "MAX_DOWNLOAD_LIMIT".to_string(),
        "".to_string(),
    );
    let conn = pool.get();
    let _ = Setting::find_by_name_or_create(
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
    let _ = Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "GLOBAL_OPENAI_KEY".to_string(),
        "".to_string(),
    );

    let conn = pool.get();
    let _ = Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "GOOGLE_LOGIN_ENABLED".to_string(),
        "".to_string(),
    );
    let conn = pool.get();
    let _ = Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "GOOGLE_CLIENT_KEY".to_string(),
        "".to_string(),
    );
    let conn = pool.get();
    let _ = Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "GOOGLE_CLIENT_SECRET".to_string(),
        "".to_string(),
    );
    let conn = pool.get();
    let _ = Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "SAML_LOGIN_ENABLED".to_string(),
        "".to_string(),
    );
    let conn = pool.get();
    let _ = Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "SAML_IDP_METADATA_XML".to_string(),
        "".to_string(),
    );
    let conn = pool.get();
    let _ = Setting::find_by_name_or_create(
        &mut conn.unwrap(),
        "SAML_ENTITY_ID".to_string(),
        "".to_string(),
    );

    let resp = generate_saml_keys();

    if let Ok((private_key, public_key)) = resp {
        let conn = pool.get();
        let _ = Setting::find_by_name_or_create(
            &mut conn.unwrap(),
            "SAML_PRIVATE_KEY".to_string(),
            private_key,
        );

        let conn = pool.get();
        let _ = Setting::find_by_name_or_create(
            &mut conn.unwrap(),
            "SAML_PUBLIC_KEY".to_string(),
            public_key,
        );
    }
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
    println!("Admin user created: {:?}", admin);
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
}

fn generate_saml_keys() -> Result<(String, String), String> {
    // // Generate a 2048-bit RSA key pair
    // let rsa = Rsa::generate(2048).map_err(|_| "Failed to generate RSA key".to_string())?;
    //
    //
    // // Extract the private key as PEM
    // let private_key_pem = format!(
    //     "{}",
    //     String::from_utf8_lossy(
    //         rsa.private_key_to_pem()
    //             .map_err(|_| "Failed to get Private key".to_string())?
    //             .as_slice()
    //     )
    // );
    //
    // // Extract the public key as PEM
    // let public_key_pem = format!(
    //     "{}",
    //     String::from_utf8_lossy(
    //         rsa.public_key_to_pem()
    //             .map_err(|_| "Failed to Public key".to_string())?
    //             .as_slice()
    //     )
    // );
    //
    // // Output the keys
    let mut rng = OsRng;
    let bits = 2048; // Key size
    let private_key = RsaPrivateKey::new(&mut rng, bits)
        .map_err(|err| format!("failed to initiate private key: {}", err))?;
    let private_key_pem = private_key
        .to_pkcs8_pem(LineEnding::LF)
        .map_err(|err| format!("failed to initiate private key: {}", err))?;

    // Convert RSA Private Key to a format rcgen can use
    let key_pair = KeyPair::from_pem(private_key_pem.as_ref())
        .map_err(|err| format!("failed to create private key: {}", err))?;

    // Set up certificate parameters
    let mut params = CertificateParams::new(vec!["*".to_string()]);
    params.key_pair = Some(key_pair);
    let signature_algorithm = &rcgen::PKCS_RSA_SHA256;
    params.alg = signature_algorithm;

    // Generate the certificate
    let cert = Certificate::from_params(params)
        .map_err(|err| format!("failed to create certificate key: {}", err))?;
    // Output the generated private key and certificate
    let cert_pem = cert
        .serialize_pem()
        .map_err(|err| format!("failed to serialize certificate key: {}", err))?;

    Ok((private_key_pem.to_string(), cert_pem))
}
