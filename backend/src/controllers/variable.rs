use std::sync::Arc;

use crate::{
    errors::AGError,
    repository::{
        models::{Variable, VariableView},
        DBPool,
    },
};
use actix_web::{web, HttpResponse, Responder};
use serde::Deserialize;

use super::common::ResponseData;

use crate::repository::permissions::PermissionNames;
use crate::repository::permissions::PermissionNames::*;
use actix_web_grants::proc_macro::has_permissions;
#[derive(Deserialize)]
pub struct QueryParams {
    question_id: Option<i64>,
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

    return Err(AGError::<String>::new("No question id provided"));
}
