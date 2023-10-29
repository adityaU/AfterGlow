use actix_web::{error, web, HttpRequest, HttpResponse, Responder};
use serde::Deserialize;
use std::sync::Arc;

use crate::{
    controllers::common::ResponseData,
    repository::{models::Question, DBPool},
    views::question::{QuestionIndexView, QuestionShowView},
};
use actix_web_grants::{permissions::AuthDetails, proc_macro::has_permissions};

#[derive(Deserialize)]
pub struct QueryParams {
    tag: Option<String>,
    q: Option<String>,
}

pub(crate) async fn show(pool: web::Data<Arc<DBPool>>, item_id: web::Path<i32>) -> impl Responder {
    let conn = pool.get();
    Question::find(&mut conn.unwrap(), item_id.into_inner())
        .map(|item| {
            let conn = pool.get();
            HttpResponse::Ok().json(ResponseData {
                data: QuestionShowView::from_model(&mut conn.unwrap(), &item),
            })
        })
        .map_err(|err| error::ErrorBadRequest(err))
}

#[has_permissions("Any")]
pub(crate) async fn index(
    pool: web::Data<Arc<DBPool>>,
    params: web::Query<QueryParams>,
    req: HttpRequest,
    auth_details: AuthDetails,
) -> impl Responder {
    let tag = params.tag.clone().unwrap_or("".to_string());
    let tag_id = tag.parse::<i32>().unwrap_or(0);
    let q = params.q.clone().unwrap_or("".to_string());
    let conn = pool.get();
    let permissions = auth_details.permissions;
    let current_user_email = req
        .headers()
        .get("user_email")
        .unwrap()
        .to_str()
        .unwrap()
        .to_string();
    Question::search(
        &mut conn.unwrap(),
        q,
        tag_id,
        current_user_email,
        permissions,
    )
    .map(|items| {
        let conn = pool.get();
        QuestionIndexView::from_models(&mut conn.unwrap(), &items)
            .map(|items| HttpResponse::Ok().json(ResponseData { data: items }))
            .map_err(|err| error::ErrorBadRequest(err))
    })
    .map_err(|err| error::ErrorBadRequest(err))
}
