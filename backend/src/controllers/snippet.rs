use actix_web::{web, HttpResponse, Responder};

use super::base;
use std::sync::Arc;

use crate::errors::AGError;
use crate::repository::models::{Snippet, SnippetChangeset, SnippetView};
use crate::{controllers::common::ResponseData, repository::DBPool};

use serde::Deserialize;

use actix_web::http::StatusCode;

use actix_web_grants::proc_macro::has_permissions;

#[derive(Deserialize)]
pub struct QueryParams {
    database_id: Option<i32>,
}

#[has_permissions("Question.edit")]
pub(crate) async fn index(
    pool: web::Data<Arc<DBPool>>,
    query: web::Query<QueryParams>,
) -> impl Responder {
    let conn = pool.get();
    Snippet::find_by_database_id(&mut conn.unwrap(), &query.database_id.unwrap_or(0))
        .map(|items| {
            let resp = items
                .iter()
                .map(|item| SnippetView::from_model(item))
                .collect::<Vec<SnippetView>>();
            HttpResponse::Ok().json(ResponseData { data: resp })
        })
        .map_err(|err| AGError::<String>::new(err))
}

base::generate_create!(
    create,
    Snippet,
    SnippetChangeset,
    SnippetView,
    "Question.edit"
);
base::generate_update!(
    update,
    Snippet,
    SnippetChangeset,
    SnippetView,
    "Question.edit",
    i64
);
base::generate_show!(show, Snippet, SnippetView, "Question.edit", i64);
