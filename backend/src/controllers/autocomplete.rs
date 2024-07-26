use std::sync::Arc;

use actix_web::{web, HttpRequest, HttpResponse, Responder};

use crate::controllers::helpers::get_current_user_id;
use crate::{app::autocomplete, errors::AGError, repository::DBPool};

use super::common::ResponseData;
use super::helpers::get_current_user_org_id;

use crate::repository::permissions::PermissionNames;
use crate::repository::permissions::PermissionNames::*;
use actix_web_grants::proc_macro::has_permissions;

#[derive(serde::Deserialize)]
pub struct QueryParams {
    query: String,
    prefix: Option<String>,
    database_id: Option<i64>,
}

#[derive(serde::Deserialize)]
pub struct AICompleteParams {
    prompt: String,
    database_id: Option<i64>,
}

#[has_permissions["QuestionEdit", type = "PermissionNames"]]
pub(crate) async fn complete(
    pool: web::Data<Arc<DBPool>>,
    qp: web::Query<QueryParams>,
) -> impl Responder {
    let conn = pool.get();
    autocomplete::complete(
        &mut conn.unwrap(),
        qp.query.as_str(),
        qp.prefix.clone().unwrap_or_default().as_str(),
        qp.database_id.unwrap_or_default(),
    )
    .map(|items| HttpResponse::Ok().json(ResponseData { data: items }))
    .map_err(|err| AGError::<String>::new(err))
}

#[has_permissions["QuestionEdit", type = "PermissionNames"]]
pub(crate) async fn recipients(
    pool: web::Data<Arc<DBPool>>,
    qp: web::Query<QueryParams>,
) -> impl Responder {
    let conn = pool.get();
    HttpResponse::Ok().json(ResponseData {
        data: autocomplete::recipients(&mut conn.unwrap(), qp.query.clone()),
    })
}

#[has_permissions["QuestionEdit", type = "PermissionNames"]]
pub(crate) async fn ai_complete(
    pool: web::Data<Arc<DBPool>>,
    data: web::Json<AICompleteParams>,
    req: HttpRequest,
) -> impl Responder {
    let conn = pool.get();
    let aiqp = data.into_inner();
    let current_user_id = get_current_user_id(&req);
    let current_user_org_id = get_current_user_org_id(&req);
    autocomplete::ai_complete(
        &mut conn.unwrap(),
        aiqp.database_id.unwrap_or_default(),
        current_user_id,
        current_user_org_id,
        aiqp.prompt.clone(),
    )
    .await
    .map(|items| HttpResponse::Ok().json(ResponseData { data: items }))
    .map_err(|err| AGError::<String>::new(err))
}
