use actix_web::{web, HttpResponse, Responder};

use super::base;

use crate::app::api_actions;
use crate::app::questions::config::Variable;
use crate::app::results::payload_adapter::make_variable;
use crate::errors::AGError;
use crate::repository::models::{ActionLevel, ApiAction, ApiActionChangeset, ApiActionView};

use crate::{controllers::common::ResponseData, repository::DBPool};

use serde::Deserialize;

use actix_web_grants::proc_macro::has_permissions;

use std::sync::Arc;

#[derive(Debug, Deserialize)]
pub struct QueryParams {
    question_id: Option<i32>,
}

#[derive(Debug, Deserialize)]
pub struct Payload {
    variables: Vec<Variable>,
}

pub(crate) async fn send_request(
    pool: web::Data<Arc<DBPool>>,
    _params: web::Query<QueryParams>,
    api_action_id: web::Path<i32>,
    payload: web::Json<Payload>,
) -> impl Responder {
    let conn = pool.get();
    let api_action = ApiAction::find(&mut conn.unwrap(), api_action_id.into_inner())
        .map_err(|err| AGError::<String>::new(err))?;
    let variables = make_variable(&payload.variables);
    api_actions::fetch_response(api_action.to_changeset(), variables)
        .await
        .map(|resp| HttpResponse::Ok().json(ResponseData { data: resp }))
        .map_err(|err| AGError::<String>::new(err))
}

pub(crate) async fn index(
    pool: web::Data<Arc<DBPool>>,
    params: web::Query<QueryParams>,
) -> impl Responder {
    let question_id = params.question_id.unwrap_or(0);
    if question_id == 0 {
        return Err(AGError::<String>::new(
            "question_id is required".to_string(),
        ));
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
        .map_err(|err| AGError::<String>::new(err))
}

base::generate_update!(
    update,
    ApiAction,
    ApiActionChangeset,
    ApiActionView,
    "Settings.all"
);

#[has_permissions("Settings.all")]
pub(crate) async fn create(
    pool: web::Data<Arc<DBPool>>,
    data: web::Json<ApiActionChangeset>,
) -> impl Responder {
    let conn = pool.get();
    let mut data = data.into_inner();
    data.action_level = Some(ActionLevel::QuestionResponse);
    ApiAction::create(&mut conn.unwrap(), data)
        .map(|item| {
            HttpResponse::Created().json(ResponseData {
                data: ApiActionView::from_model(&item),
            })
        })
        .map_err(|err| AGError::<String>::new(err))
}
