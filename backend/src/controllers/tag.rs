use std::sync::Arc;

use actix_web::{web, HttpRequest, HttpResponse, Responder};
use serde::Deserialize;

use crate::{
    controllers::common::ResponseData,
    errors::AGError,
    repository::{
        models::TagView,
        models::{Tag, TagChangeset},
        DBPool,
    },
};
use actix_web_grants::{permissions::AuthDetails, proc_macro::has_permissions};

use super::base;

use crate::repository::permissions::PermissionNames;
use crate::repository::permissions::PermissionNames::*;
#[derive(Deserialize)]
pub struct QueryParams {
    q: Option<String>,
}

#[has_permissions["QuestionShow", type = "PermissionNames"]]
pub(crate) async fn index(
    pool: web::Data<Arc<DBPool>>,
    req: HttpRequest,
    auth_details: AuthDetails<PermissionNames>,
) -> impl Responder {
    let conn = pool.get();
    let user_email = req
        .headers()
        .get("user_email")
        .unwrap()
        .to_str()
        .unwrap()
        .to_string();
    let permissions = auth_details.permissions;
    Tag::scoped_index(&mut conn.unwrap(), user_email, permissions)
        .map(|items| {
            let resp = items
                .iter()
                .map(|item| TagView::from_model(item))
                .collect::<Vec<TagView>>();
            HttpResponse::Ok().json(ResponseData { data: resp })
        })
        .map_err(|err| AGError::<String>::new(err))
}

pub async fn search(pool: web::Data<Arc<DBPool>>, qp: web::Query<QueryParams>) -> impl Responder {
    let conn = pool.get();
    Tag::search(&mut conn.unwrap(), qp.q.clone().unwrap_or_default())
        .map(|items| {
            let resp = items
                .iter()
                .map(|item| TagView::from_model(item))
                .collect::<Vec<TagView>>();
            HttpResponse::Ok().json(ResponseData { data: resp })
        })
        .map_err(|err| AGError::<String>::new(err))
}

base::generate_create!(create, Tag, TagChangeset, TagView, "QuestionCreate");
