use std::sync::Arc;

use actix_web::{web, HttpResponse, Responder};

use crate::{app::autocomplete, errors::AGError, repository::DBPool};

use super::common::ResponseData;

use crate::repository::permissions::PermissionNames;
use crate::repository::permissions::PermissionNames::*;
use actix_web_grants::proc_macro::has_permissions;

#[derive(serde::Deserialize)]
pub struct QueryParams {
    query: String,
    prefix: Option<String>,
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
