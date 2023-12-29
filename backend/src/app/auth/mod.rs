use std::error::Error;

use chrono::Utc;
use diesel::PgConnection;
use hmac::{Hmac, Mac};

use jwt::VerifyWithKey;
use serde_json::json;
use sha2::Sha256;

use jwt::SignWithKey;
use std::collections::BTreeMap;

use oauth2::{
    basic::BasicClient, AuthUrl, ClientId, ClientSecret, CsrfToken, PkceCodeChallenge, RedirectUrl,
    Scope, TokenUrl,
};

use reqwest::header::CONTENT_TYPE;
use serde::Deserialize;
use serde::Serialize;

use crate::repository::models::Organization;

use crate::repository::models::User;
use crate::repository::models::UserChangeset;
use crate::views::user::RestrictedUserView;
use lazy_static::lazy_static;

use super::settings::theme;
use super::settings::theme::Theme;

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
    pub permissions: Vec<String>,
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
    let claims: BTreeMap<String, String> = token_str
        .verify_with_key(&key)
        .map_err(|_err| "Invalid token")?;
    let user_id = claims
        .get("id")
        .ok_or("Invalid token".to_owned())
        .and_then(|id| id.parse::<i64>().map_err(|_| "Invalid token".to_owned()))?;
    let user = User::find(conn, user_id).map_err(|_err| "Unable to find User".to_owned())?;
    let permissions = user.fetch_permissions(conn);
    let th = theme::get(conn);
    Ok(AGCallbackResponse {
        theme: th,
        token: token_str,
        user: RestrictedUserView::from_model(&user),
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

    Ok(AGCallbackResponse {
        token,
        user: RestrictedUserView::from_model(&user),
        permissions,
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
