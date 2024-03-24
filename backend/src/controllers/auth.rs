use std::sync::Arc;

use actix_web::{error, web, web::Redirect, HttpResponse, Responder};

use crate::app::auth;
use crate::errors::AGError;
use crate::repository::DBPool;
use serde::Deserialize;
use serde::Serialize;

use super::common::ResponseData;

#[derive(Deserialize, Clone)]
pub struct Payload {
    pub token: String,
}
#[derive(Serialize, Clone)]
pub struct AuthGoogleResponse {
    pub path: String,
}

#[derive(Deserialize, Clone)]
pub struct GoogleCallbackResponse {
    pub code: String,
    pub provider: String,
}

#[derive(Deserialize, Clone)]
pub struct SamlLoginResponse {
    #[serde(rename = "SAMLResponse")]
    pub saml_response: String,
    #[serde(rename = "RelayState")]
    pub relay_state: String,
}

#[derive(Deserialize, Clone)]
pub struct LoginCredentials {
    pub email: String,
    pub password: String,
}

pub(crate) async fn veriy_token(
    pool: web::Data<Arc<DBPool>>,
    payload: web::Json<Payload>,
) -> impl Responder {
    let token_str = payload.token.clone();
    let conn = pool.get();

    auth::verify_token(&mut conn.unwrap(), token_str.to_string())
        .map(|resp| HttpResponse::Ok().json(resp))
        .map_err(|err| error::ErrorUnauthorized(err))
}

pub(crate) async fn redirect_to_google() -> impl Responder {
    let _google_client_id =
        std::env::var("AG_GOOGLE_CLIENT_ID").expect("GOOGLE_CLIENT_ID must be set");
    let _google_client_secret =
        std::env::var("AG_GOOGLE_CLIENT_SECRET").expect("GOOGLE_CLIENT_SECRET must be set");

    let redirect_url = auth::redirect_to_google();
    let resp = AuthGoogleResponse { path: redirect_url };
    HttpResponse::Ok().json(resp)
}

pub async fn google_callback(
    pool: web::Data<Arc<DBPool>>,
    payload: web::Json<GoogleCallbackResponse>,
) -> impl Responder {
    let mut conn = pool.get().unwrap();
    auth::google_callback(&mut conn, payload.code.clone())
        .await
        .map(|resp| HttpResponse::Ok().json(resp))
        .map_err(|err| AGError::<String>::new(err))
}

pub async fn saml_acs(
    pool: web::Data<Arc<DBPool>>,
    payload: web::Form<SamlLoginResponse>,
) -> impl Responder {
    let mut conn = pool.get().unwrap();
    auth::saml_acs(
        &mut conn,
        payload.saml_response.clone(),
        payload.relay_state.clone(),
    )
    .map(|resp| {
        Redirect::to(
            std::env::var("AG_APP_ROOT").unwrap_or_default()
                + "api/saml/acs?token="
                + resp.as_str(),
        )
        .see_other()
    })
    .map_err(|err| AGError::<String>::new(err))
}

pub async fn saml_metadata(pool: web::Data<Arc<DBPool>>) -> impl Responder {
    let conn = pool.get();
    auth::saml_metadata(&mut conn.unwrap())
        .map_err(|err| AGError::<String>::new(err))
        .map(|metadata| HttpResponse::Ok().body(metadata))
}

pub async fn initiate_saml(pool: web::Data<Arc<DBPool>>) -> impl Responder {
    let mut conn = pool.get().unwrap();
    auth::initiate_saml_request(&mut conn)
        .map(|resp| {
            println!("Initiate SAML Response: {:?}", &resp);
            HttpResponse::Ok().content_type("text/html").body(resp)
        })
        .map_err(|err| AGError::<String>::new(err))
}

pub async fn password_login(
    pool: web::Data<Arc<DBPool>>,
    login_credentials: web::Json<LoginCredentials>,
) -> impl Responder {
    let mut conn = pool.get().unwrap();
    auth::password_login(
        &mut conn,
        login_credentials.email.clone(),
        login_credentials.password.clone(),
    )
    .map(|resp| HttpResponse::Ok().json(ResponseData { data: resp }))
    .map_err(|err| AGError::<String>::new(err))
}
