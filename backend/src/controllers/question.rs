use actix_web::{web, HttpRequest, HttpResponse, Responder};

use chrono::NaiveDateTime;
use serde::Deserialize;
use std::sync::Arc;
use uuid::Uuid;

use crate::{
    app::questions::{
        self,
        config::{QuestionConfig, QuestionHumanSql, Variable, Visualization},
    },
    controllers::{common::ResponseData, helpers::get_current_user_email},
    errors::AGError,
    repository::{
        models::{ActionLevel, HTTPMethod, QueryType, Question},
        DBPool,
    },
    views::question::{QuestionIndexView, QuestionShowView},
};
use actix_web_grants::{permissions::AuthDetails, proc_macro::has_permissions};

use crate::repository::permissions::PermissionNames;
use crate::repository::permissions::PermissionNames::*;

#[derive(Deserialize)]
pub struct QueryParams {
    tag: Option<String>,
    q: Option<String>,
}

#[derive(Deserialize)]
pub struct QuestionPayload {
    pub id: Option<i64>,
    pub human_sql: QuestionHumanSql,
    pub query_type: QueryType,
    pub sql: String,
    pub title: String,
    pub shareable_link: Option<Uuid>,
    pub description: Option<String>,
    pub config: Option<QuestionConfig>,
    pub visualizations: Vec<Visualization>,
    pub variables: Vec<Variable>,
    pub tags: Option<Vec<TagPayload>>,
    pub shared_to: Option<Vec<Option<String>>>,
    pub api_action: Option<ApiAction>,
}

#[derive(Deserialize)]
pub struct ApiAction {
    pub id: Option<i64>,
    pub question_id: Option<i64>,
    pub url: String,
    pub headers: Option<serde_json::Value>,
    pub body: Option<String>,
    pub method: Option<HTTPMethod>,
    pub name: Option<String>,
    pub color: Option<String>,
    pub open_in_new_tab: Option<bool>,
    pub response_settings: Option<serde_json::Value>,
    pub hidden: Option<bool>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
    pub column: Option<String>,
    pub on_success: Option<i32>,
    pub on_failure: Option<i32>,
    pub failure_message: Option<String>,
    pub failure_key: Option<String>,
    pub success_message: Option<String>,
    pub success_key: Option<String>,
    pub action_level: Option<ActionLevel>,
    pub visualization_id: Option<i32>,
    pub loading_message: Option<String>,
    pub display_settings: Option<serde_json::Value>,
    pub open_option: Option<String>,
}

#[derive(Deserialize)]
pub struct TagPayload {
    pub id: Option<i64>,
    pub color: Option<String>,
    pub name: Option<String>,
    pub description: Option<String>,
}

pub(crate) async fn show(
    pool: web::Data<Arc<DBPool>>,
    item_id: web::Path<i64>,
    req: HttpRequest,
    auth_details: AuthDetails<PermissionNames>,
) -> impl Responder {
    let conn = pool.get();
    let permissions = auth_details.permissions;
    let current_user_email = get_current_user_email(&req);
    Question::find_shared(
        &mut conn.unwrap(),
        item_id.into_inner(),
        current_user_email,
        permissions,
    )
    .map(|item| {
        let conn = pool.get();
        HttpResponse::Ok().json(ResponseData {
            data: QuestionShowView::from_model(&mut conn.unwrap(), &item),
        })
    })
    .map_err(|err| AGError::<String>::new(err))
}

#[has_permissions["QuestionShow", type = "PermissionNames"]]
pub(crate) async fn index(
    pool: web::Data<Arc<DBPool>>,
    params: web::Query<QueryParams>,
    req: HttpRequest,
    auth_details: AuthDetails<PermissionNames>,
) -> impl Responder {
    let tag = params.tag.clone().unwrap_or("".to_string());
    let tag_id = tag.parse::<i64>().unwrap_or(0);
    let q = params.q.clone().unwrap_or("".to_string());
    let conn = pool.get();
    let permissions = auth_details.permissions;
    let current_user_email = get_current_user_email(&req);
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
            .map_err(|err| AGError::<String>::new(err))
    })
    .map_err(|err| AGError::<String>::new(err))
}

#[has_permissions["QuestionCreate", type = "PermissionNames"]]
pub(crate) async fn create(
    pool: web::Data<Arc<DBPool>>,
    data: web::Json<QuestionPayload>,
    req: HttpRequest,
) -> impl Responder {
    let conn = pool.get();
    let qp = data.into_inner();
    questions::save(&mut conn.unwrap(), qp, req)
        .map(|item| HttpResponse::Created().json(ResponseData { data: item }))
        .map_err(|err| AGError::<String>::new(err))
}
