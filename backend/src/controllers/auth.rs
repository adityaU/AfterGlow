use std::sync::Arc;



use actix_web::{error, web, HttpResponse, Responder};

use crate::app::auth;
use crate::errors::AGError;
use crate::repository::DBPool;
use serde::Deserialize;
use serde::Serialize;

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
