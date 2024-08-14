use actix_web::{error, web, HttpRequest, HttpResponse, Responder};

use chrono::NaiveDateTime;
use reqwest::StatusCode;
use serde::Deserialize;
use std::sync::Arc;
use uuid::Uuid;

use crate::{
    app::questions::{
        self,
        config::{QuestionConfig, QuestionHumanSql, Variable, Visualization},
    },
    controllers::{
        common::ResponseData,
        helpers::{get_current_user_email, get_current_user_id},
    },
    errors::AGError,
    repository::{
        models::{ActionLevel, HTTPMethod, QueryType, Question, QuestionChangeset},
        DBPool,
    },
    views::question::{QuestionIndexView, QuestionShowView},
};
use actix_web_grants::{permissions::AuthDetails, proc_macro::has_permissions};

use crate::repository::permissions::PermissionNames;
use crate::repository::permissions::PermissionNames::*;

use super::base;

#[derive(Deserialize)]
pub struct QueryParams {
    tag: Option<String>,
    q: Option<String>,
}

#[derive(Deserialize)]
pub struct ShowParams {
    share_id: Option<String>,
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
    qp: web::Query<ShowParams>,
    auth_details: AuthDetails<PermissionNames>,
) -> impl Responder {
    let conn = pool.get();
    let permissions = auth_details.permissions;
    let current_user_email = get_current_user_email(&req);
    let question_id = item_id.into_inner();

    if qp.share_id.clone().is_some() {
        let question = Question::find(&mut conn.unwrap(), question_id).map_err(|err| {
            AGError::<String>::new_with_details(
                error::ErrorNotFound("Unauthorized").to_string(),
                Some(err.to_string()),
                StatusCode::NOT_FOUND,
            )
        })?;
        let share_id = question.shareable_link.unwrap_or_default().to_string();

        if share_id == qp.share_id.clone().unwrap_or_default()
            && !question
                .shared_to
                .clone()
                .unwrap_or_default()
                .contains(&Some(current_user_email.clone()))
        {
            let mut shared_to = question.shared_to.unwrap_or_default().clone();
            shared_to.push(Some(current_user_email));
            let conn = pool.get();
            return Question::update(
                &mut conn.unwrap(),
                question_id,
                QuestionChangeset {
                    title: question.title,
                    last_updated: question.last_updated,
                    sql: question.sql,
                    human_sql: question.human_sql,
                    inserted_at: question.inserted_at,
                    updated_at: question.updated_at,
                    query_type: question.query_type,
                    shareable_link: question.shareable_link,
                    is_shareable_link_public: question.is_shareable_link_public,
                    results_view_settings: question.results_view_settings,
                    columns_: question.columns_,
                    cached_results: question.cached_results,
                    shared_to: Some(shared_to),
                    owner_id: question.owner_id,
                    config: question.config,
                },
            )
            .map(|item| {
                let conn = pool.get();
                HttpResponse::Ok().json(ResponseData {
                    data: QuestionShowView::from_model(&mut conn.unwrap(), &item),
                })
            })
            .map_err(AGError::<String>::new);
        }
    }

    let conn = pool.get();
    Question::find_shared(
        &mut conn.unwrap(),
        question_id,
        current_user_email,
        permissions,
    )
    .map(|item| {
        let conn = pool.get();
        HttpResponse::Ok().json(ResponseData {
            data: QuestionShowView::from_model(&mut conn.unwrap(), &item),
        })
    })
    .map_err(AGError::<String>::new)
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
            .map_err(AGError::<String>::new)
    })
    .map_err(AGError::<String>::new)
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
        .map_err(AGError::<String>::new)
}

#[has_permissions["QuestionDelete",type = "PermissionNames"]]
pub(crate) async fn delete(
    pool: web::Data<Arc<DBPool>>,
    item_id: web::Path<i64>,
    req: HttpRequest,
    auth_details: AuthDetails<PermissionNames>,
) -> impl Responder {
    let conn = pool.get();
    let question_id = item_id.into_inner();

    let user_id = get_current_user_id(&req);
    let question = Question::find(&mut conn.unwrap(), question_id).map_err(|err| {
        AGError::<String>::new_with_details(
            error::ErrorNotFound("Unauthorized").to_string(),
            Some(err.to_string()),
            StatusCode::NOT_FOUND,
        )
    })?;
    if question.owner_id.unwrap_or_default() != user_id
        && !auth_details.has_permission(&PermissionNames::SettingsAll)
    {
        return Err(AGError::<String>::new_with_details(
            error::ErrorUnauthorized("Unauthorized").to_string(),
            Some("you do not have permission to delete this question. Only the owner or Admins can delete this question".to_string()),
            StatusCode::UNAUTHORIZED

        ));
    }
    let conn = pool.get();
    questions::delete(&mut conn.unwrap(), question_id, req, auth_details)
        .map(|_item| HttpResponse::Ok().json(ResponseData { data: "success" }))
        .map_err(AGError::new)
}
