use actix_web::{error, web, HttpResponse, Responder};

use super::base;

use crate::repository::models::{ApiAction, ApiActionChangeset, ApiActionView};

use crate::{controllers::common::ResponseData, repository::DBPool};

use serde::Deserialize;

use actix_web_grants::proc_macro::has_permissions;

use std::sync::Arc;

#[derive(Debug, Deserialize)]
pub struct QueryParams {
    question_id: Option<i32>,
}

#[has_permissions("Any")]
pub(crate) async fn index(
    pool: web::Data<DBPool>,
    params: web::Query<QueryParams>,
) -> impl Responder {
    let question_id = params.question_id.unwrap_or(0);
    if question_id == 0 {
        return Err(error::ErrorBadRequest("question_id is required"));
    }
    let conn = pool.get();
    ApiAction::find_by_question_id(&mut conn.unwrap(), question_id)
        .map(|items| {
            let resp = items
                .iter()
                .map(|item| ApiActionView::from_model(item))
                .collect::<Vec<ApiActionView>>();
            HttpResponse::Ok().json(ResponseData { data: resp })
        })
        .map_err(|err| error::ErrorBadRequest(err))
}

base::generate_update!(
    update,
    ApiAction,
    ApiActionChangeset,
    ApiActionView,
    "Settings.all"
);
