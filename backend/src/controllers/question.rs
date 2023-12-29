use actix_web::{web, HttpRequest, HttpResponse, Responder};

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
        models::{QueryType, Question},
        DBPool,
    },
    views::question::{QuestionIndexView, QuestionShowView},
};
use actix_web_grants::{permissions::AuthDetails, proc_macro::has_permissions};

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
}

#[derive(Deserialize)]
pub struct TagPayload {
    pub id: Option<i64>,
    pub color: Option<String>,
    pub name: Option<String>,
    pub description: Option<String>,
}

pub(crate) async fn show(pool: web::Data<Arc<DBPool>>, item_id: web::Path<i64>) -> impl Responder {
    let conn = pool.get();
    Question::find(&mut conn.unwrap(), item_id.into_inner())
        .map(|item| {
            let conn = pool.get();
            HttpResponse::Ok().json(ResponseData {
                data: QuestionShowView::from_model(&mut conn.unwrap(), &item),
            })
        })
        .map_err(|err| AGError::<String>::new(err))
}

#[has_permissions("Any")]
pub(crate) async fn index(
    pool: web::Data<Arc<DBPool>>,
    params: web::Query<QueryParams>,
    req: HttpRequest,
    auth_details: AuthDetails,
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

#[has_permissions("Question.create")]
pub(crate) async fn create(
    pool: web::Data<Arc<DBPool>>,
    data: web::Json<QuestionPayload>,
    req: HttpRequest,
) -> impl Responder {
    let conn = pool.get();
    let qp = data.into_inner();
    questions::create(&mut conn.unwrap(), qp, req)
        .map(|item| HttpResponse::Created().json(ResponseData { data: item }))
        .map_err(|err| AGError::<String>::new(err))
}
