use std::sync::Arc;

use crate::{
    errors::AGError,
    repository::{
        models::{Variable, VariableChangeset, VariableView},
        DBPool,
    },
};
use actix_web::{error, web, HttpResponse, Responder};
use serde::Deserialize;

use super::{base, common::ResponseData};

use crate::repository::permissions::PermissionNames;
use crate::repository::permissions::PermissionNames::*;
use actix_web_grants::proc_macro::has_permissions;
#[derive(Deserialize)]
pub struct QueryParams {
    question_id: Option<i64>,
    ids: Option<String>,
}

#[has_permissions["QuestionShow", type = "PermissionNames"]]
pub(crate) async fn index(
    pool: web::Data<Arc<DBPool>>,
    params: web::Query<QueryParams>,
) -> impl Responder {
    if params.question_id.unwrap_or(0) != 0 {
        let conn = pool.get();
        let question_id = params.question_id.unwrap();
        let resp = Variable::find_by_question_id(&mut conn.unwrap(), question_id)
            .map(|tags| {
                let resp = tags
                    .iter()
                    .map(|tag| VariableView::from_model(tag))
                    .collect::<Vec<VariableView>>();
                HttpResponse::Ok().json(ResponseData { data: resp })
            })
            .map_err(|err| AGError::<String>::new(err));
        return resp;
    }

    if params.ids.is_some() {
        let conn = pool.get();
        let ids = params
            .ids
            .clone()
            .unwrap_or_default()
            .split(",")
            .map(|id| id.parse::<i64>().unwrap())
            .collect::<Vec<i64>>();
        let resp = Variable::find_by_ids(&mut conn.unwrap(), ids)
            .map(|tags| {
                let resp = tags
                    .iter()
                    .map(|tag| VariableView::from_model(tag))
                    .collect::<Vec<VariableView>>();
                HttpResponse::Ok().json(ResponseData { data: resp })
            })
            .map_err(|err| AGError::<String>::new(err));
        return resp;
    }

    return Err(AGError::<String>::new("No question id provided"));
}

#[has_permissions["QuestionShow",type = "PermissionNames"]]
pub(crate) async fn show(pool: web::Data<Arc<DBPool>>, item_id: web::Path<i64>) -> impl Responder {
    let conn = pool.get();
    Variable::find(&mut conn.unwrap(), item_id.into_inner())
        .map(|item| {
            HttpResponse::Ok().json(ResponseData {
                data: VariableView::from_model(&item),
            })
        })
        .map_err(|err| error::ErrorNotFound(err))
}

base::generate_create!(
    create,
    Variable,
    VariableChangeset,
    VariableView,
    "DashboardEdit"
);

base::generate_update!(
    update,
    Variable,
    VariableChangeset,
    VariableView,
    "DashboardEdit"
);

base::generate_delete!(delete, Variable, "DashboardEdit");
