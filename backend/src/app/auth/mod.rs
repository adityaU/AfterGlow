use std::error::Error;

use chrono::Duration;
use chrono::Utc;
use diesel::PgConnection;
use hmac::{Hmac, Mac};

use jwt::VerifyWithKey;

use samael::service_provider::ServiceProvider;
use serde_json::json;
use sha2::Sha256;

use jwt::SignWithKey;
use std::collections::BTreeMap;
use uuid::Uuid;

use oauth2::{
    basic::BasicClient, AuthUrl, ClientId, ClientSecret, CsrfToken, PkceCodeChallenge, RedirectUrl,
    Scope, TokenUrl,
};

use reqwest::header::CONTENT_TYPE;
use serde::Deserialize;
use serde::Serialize;

use crate::repository::models::Database;
use crate::repository::models::Organization;

use crate::repository::models::User;
use crate::repository::models::UserChangeset;
use crate::repository::permissions::PermissionNames;

use crate::views::user::RestrictedUserView;
use lazy_static::lazy_static;

use super::settings::saml;
use super::settings::theme;
use super::settings::theme::Theme;

use samael::metadata::{ContactPerson, ContactType, EntityDescriptor};
use samael::service_provider::ServiceProviderBuilder;

#[derive(Deserialize)]
pub struct OAuthResponse {
    pub access_token: String,
    pub id_token: String,
}

#[derive(Deserialize, Serialize)]
pub struct GoogleUserResult {
    pub id: String,
    pub email: String,
    pub verified_email: bool,
    pub name: String,
    pub given_name: String,
    pub family_name: String,
    pub picture: String,
    pub locale: String,
}

#[derive(Deserialize, Serialize)]
pub struct AGCallbackResponse {
    pub token: String,
    pub user: RestrictedUserView,
    pub permissions: Vec<PermissionNames>,
    databases: Vec<Uuid>,
    pub theme: Theme,
}

lazy_static! {
    static ref GOOGLE_CLIENT_ID: String = std::env::var("AG_GOOGLE_CLIENT_ID").unwrap();
}
lazy_static! {
    static ref GOOGLE_CLIENT_SECRET: String = std::env::var("AG_GOOGLE_CLIENT_SECRET").unwrap();
}
lazy_static! {
    static ref REDIRECT_URL: String =
        (std::env::var("AG_APP_ROOT").unwrap() + "api/google/callback").to_string();
}
pub fn verify_token(
    conn: &mut PgConnection,
    token_str: String,
) -> Result<AGCallbackResponse, String> {
    let key: Hmac<Sha256> = Hmac::new_from_slice(b"my_secret").map_err(|_| "Invalid Start")?;
    let claims: BTreeMap<String, Option<String>> = token_str
        .verify_with_key(&key)
        .map_err(|err| "Invalid token: ".to_owned() + &err.to_string())?;
    let user_id = claims
        .get("id")
        .ok_or("Invalid token".to_owned())
        .and_then(|id| {
            id.clone()
                .unwrap_or("0".to_string())
                .parse::<i64>()
                .map_err(|_| "Invalid token".to_owned())
        })?;
    let user = User::find(conn, user_id).map_err(|_err| "Unable to find User".to_owned())?;
    let permissions = user.fetch_permissions(conn);
    let th = theme::get(conn);
    let databases = Database::find_for_user(
        conn,
        user.email.clone().unwrap_or_default(),
        permissions.clone(),
    )
    .unwrap_or_default()
    .into_iter()
    .map(|db| db.unique_identifier.unwrap_or_default())
    .collect::<Vec<Uuid>>();
    Ok(AGCallbackResponse {
        theme: th,
        token: token_str,
        user: RestrictedUserView::from_model(&user),
        databases,
        permissions,
    })
}

pub fn redirect_to_google() -> String {
    // In prod, http://localhost:8000 would get replaced by whatever your production URL is
    let client = google_client();

    let (_pkce_code_challenge, _pkce_code_verifier) = PkceCodeChallenge::new_random_sha256();

    // Generate the authorization URL to which we'll redirect the user.
    let (authorize_url, _csrf_state) = client
        .authorize_url(CsrfToken::new_random)
        // This example is requesting access to the "calendar" features and the user's profile.
        .add_scope(Scope::new(
"https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email".to_string()
        ))
        .url();

    authorize_url.to_string()
}

pub async fn get_oauth_response(code: String) -> Result<OAuthResponse, Box<dyn Error>> {
    let root_url = "https://oauth2.googleapis.com/token";
    let client = reqwest::Client::new();
    let url = reqwest::Url::parse(&("https://try.com/".to_owned() + code.as_str()))?;
    let auth_code = url.query_pairs().find(|(key, _)| key == "code");
    let authorization_code = match auth_code {
        Some((_, value)) => value.into_owned(),
        None => "Invalid".to_string(),
    };

    let params = [
        ("grant_type", "authorization_code"),
        ("redirect_uri", &REDIRECT_URL.as_str()),
        ("client_id", &GOOGLE_CLIENT_ID.as_str()),
        ("code", authorization_code.as_str()),
        ("client_secret", &GOOGLE_CLIENT_SECRET.as_str()),
    ];
    let response = client
        .post(root_url)
        .header(CONTENT_TYPE, "application/x-www-form-urlencoded")
        .form(&params)
        .send()
        .await?;

    if response.status().is_success() {
        let oauth_response = response.json::<OAuthResponse>().await?;
        Ok(oauth_response)
    } else {
        let message = "An error occurred while trying to retrieve access token.";
        Err(From::from(message))
    }
}

pub async fn get_google_user(
    access_token: String,
    id_token: String,
) -> Result<GoogleUserResult, Box<dyn Error>> {
    let client = reqwest::Client::new();
    let mut url = reqwest::Url::parse("https://www.googleapis.com/oauth2/v1/userinfo").unwrap();
    url.query_pairs_mut().append_pair("alt", "json");
    url.query_pairs_mut()
        .append_pair("access_token", access_token.as_str());

    let response = client.get(url).bearer_auth(id_token).send().await?;

    if response.status().is_success() {
        let user_info = response.json::<GoogleUserResult>().await?;
        Ok(user_info)
    } else {
        let message = "An error occurred while trying to retrieve user information.";
        Err(From::from(message))
    }
}

fn sign(user: &User) -> String {
    let key: Hmac<Sha256> = Hmac::new_from_slice(b"my_secret")
        .map_err(|_| "Invalid Start")
        .unwrap();
    let user_id = Some(user.id.to_string().clone());
    let mut claims = BTreeMap::new();
    claims.insert("email", &user.email);
    claims.insert("id", &user_id);
    claims.insert("profile_pic", &user.profile_pic);
    claims.insert("full_name", &user.full_name);

    claims.sign_with_key(&key).unwrap_or("invalid".to_string())
}

pub async fn google_callback(
    conn: &mut PgConnection,
    code: String,
) -> Result<AGCallbackResponse, Box<dyn Error>> {
    let oauth_response = get_oauth_response(code).await?;
    let google_user = get_google_user(oauth_response.access_token, oauth_response.id_token).await?;
    let org_id = find_org_id(conn, google_user.email.clone());
    let user = UserChangeset {
        email: Some(google_user.email.clone()),
        first_name: Some(google_user.given_name.clone()),
        last_name: Some(google_user.family_name.clone()),
        metadata: Some(json!(&google_user)),
        full_name: Some(google_user.name.clone()),
        profile_pic: Some(google_user.picture.clone()),
        inserted_at: Utc::now().naive_utc(),
        updated_at: Utc::now().naive_utc(),
        is_deactivated: Some(false),
        organization_id: org_id,
        password: None,
    };
    let user = User::create_or_update(conn, user)?;
    let permissions = user.fetch_permissions(conn);
    let token = sign(&user);
    let th = theme::get(conn);

    let databases = Database::find_for_user(
        conn,
        user.email.clone().unwrap_or_default(),
        permissions.clone(),
    )
    .unwrap_or_default()
    .into_iter()
    .map(|db| db.unique_identifier.unwrap_or_default())
    .collect::<Vec<Uuid>>();

    Ok(AGCallbackResponse {
        token,
        user: RestrictedUserView::from_model(&user),
        permissions,
        databases,
        theme: th,
    })
}

fn find_org_id(conn: &mut PgConnection, email: String) -> Option<i64> {
    let parts: Vec<&str> = email.split("@").collect();
    let domain = parts.last().unwrap();
    Organization::find_by_domain(conn, domain)
        .ok()
        .map(|org| org.id)
}

fn google_client() -> BasicClient {
    // If you're not using Google OAuth, you can use whatever the relevant auth/token URL is for your given OAuth service
    let auth_url = AuthUrl::new("https://accounts.google.com/o/oauth2/v2/auth".to_string())
        .expect("Invalid authorization endpoint URL");
    let token_url = TokenUrl::new("https://www.googleapis.com/oauth2/v3/token".to_string())
        .expect("Invalid token endpoint URL");

    BasicClient::new(
        ClientId::new(GOOGLE_CLIENT_ID.clone()),
        Some(ClientSecret::new(GOOGLE_CLIENT_SECRET.clone())),
        auth_url,
        Some(token_url),
    )
    .set_redirect_uri(RedirectUrl::new(REDIRECT_URL.clone()).expect("Invalid redirect URL"))
}

pub fn initiate_saml_request(conn: &mut PgConnection) -> Result<String, String> {
    let mut auth_req = get_service_provider_config(conn)
        .unwrap()
        .make_authentication_request("http://localhost:8080/realms/master/protocol/saml")
        .unwrap();
    auth_req.protocol_binding =
        Some("urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect".to_string());

    Ok(auth_req
        .post("relay_start")
        .map_err(|err| format!("Error Initiating SAML Request: {}", err))?
        .unwrap()
        .into())
}

pub fn password_login(
    conn: &mut PgConnection,
    email: String,
    password: String,
) -> Result<String, String> {
    let user = User::find_by_email(conn, email.clone()).map_err(|_| "Invalid Email".to_string())?;
    if user.is_deactivated.unwrap_or(false) {
        return Err("User is deactivated".to_string());
    }
    println!("User: {:?}", &user);
    println!("Password: {:?}", &password);
    println!(
        "Encrypted Password: {:?}",
        &User::encrypt_password(password.clone())
    );
    if User::encrypt_password(password.clone()) != user.password.unwrap_or("".to_string()) {
        return Err("Invalid Password".to_string());
    }
    let key: Hmac<Sha256> = Hmac::new_from_slice(b"my_secret").map_err(|_| "Invalid Start")?;
    let user_id = Some(user.id.to_string().clone());
    let mut claims = BTreeMap::new();
    claims.insert("email", &user.email);
    claims.insert("id", &user_id);
    claims.insert("profile_pic", &user.profile_pic);
    claims.insert("full_name", &user.full_name);
    let token = claims.sign_with_key(&key).unwrap_or("invalid".to_string());
    Ok(token)
}

pub fn saml_metadata(conn: &mut PgConnection) -> Result<String, String> {
    get_service_provider_config(conn)?
        .metadata()
        .map_err(|err| format!("Error Building SAML SP Config XML: {}", err.to_string()))?
        .to_xml()
        .map_err(|err| format!("Error Building SAML SP Config XML: {}", err.to_string()))
}

pub fn saml_acs(
    conn: &mut PgConnection,
    saml_response: String,
    _relay_state: String,
) -> Result<String, String> {
    let sp = get_service_provider_config(conn)
        .map_err(|err| format!("Error Gettting SP config: {}", err))?;
    let resp = sp
        .parse_base64_response(saml_response.as_str(), None)
        .map_err(|err| err.to_string())?;
    let subject = resp.subject.clone();
    if subject.is_none() {
        return Err("Invalid SAML Response: Couldn't parse Email, Subject missing".to_string());
    }
    let name_id = subject.unwrap().name_id;
    if name_id.is_none() {
        return Err("Invalid SAML Response: Couldn't parse Email, NameID missing".to_string());
    }

    if name_id.unwrap().format.clone()
        != Some("urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress".to_string())
    {
        return Err("Invalid SAML Response: Couldn't parse Email, Email ID not returned. Wrond Format Found".to_string());
    }

    let email = &resp.subject.unwrap().name_id.unwrap().value.clone();
    let org_id = find_org_id(conn, email.clone());
    let user = UserChangeset {
        email: Some(email.clone()),
        first_name: None,
        last_name: None,
        metadata: None,
        full_name: None,
        profile_pic: None,
        inserted_at: Utc::now().naive_utc(),
        updated_at: Utc::now().naive_utc(),
        is_deactivated: Some(false),
        organization_id: org_id,
        password: None,
    };
    let user = User::create_or_update(conn, user).map_err(|err| err.to_string())?;
    // let permissions = user.fetch_permissions(conn);
    let token = sign(&user);
    // let th = theme::get(conn);
    Ok(token)
}

fn get_service_provider_config(conn: &mut PgConnection) -> Result<ServiceProvider, String> {
    let saml_config =
        saml::get(conn).map_err(|err| format!("Error Fetching SAML Config: {}", err))?;
    let idp_metadata: EntityDescriptor =
        samael::metadata::de::from_str(saml_config.idp_metadata_xml.as_str())
            .map_err(|err| format!("Error Parsing SAML IDP Metadata XML: {}", err))?;

    let pub_key = openssl::x509::X509::from_pem(saml_config.public_key.as_bytes())
        .map_err(|err| format!("Error Parsing Public key: {}", err))?;
    let private_key = openssl::rsa::Rsa::private_key_from_pem(saml_config.private_key.as_bytes())
        .map_err(|err| format!("Error Parsing Private key: {}", err))?;
    ServiceProviderBuilder::default()
        .entity_id(saml_config.entiry_id)
        .key(private_key)
        .certificate(pub_key)
        .allow_idp_initiated(true)
        .contact_person(ContactPerson {
            sur_name: Some("Bob".to_string()),
            contact_type: Some(ContactType::Technical.value().to_string()),
            ..ContactPerson::default()
        })
        .idp_metadata(idp_metadata)
        .acs_url(saml_config.acs_url)
        .slo_url(saml_config.slo_url)
        .metadata_valid_duration(Duration::days(1000))
        .build()
        .map_err(|err| format!("Error Building SAML SP Config XML: {}", err.to_string()))
}
