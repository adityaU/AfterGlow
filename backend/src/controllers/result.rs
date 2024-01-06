use std::sync::{Arc, Mutex};

use actix_web::{web, HttpRequest, HttpResponse, Responder};
use serde::Serialize;

use crate::{
    app::{
        questions::config,
        results::{self, fetch},
        visualizations::viz,
    },
    repository::DBPool,
};

use super::helpers::{get_current_user_id, get_current_user_ord_id};
use actix_web_grants::{permissions::AuthDetails, proc_macro::has_permissions};

use crate::repository::permissions::PermissionNames;
use crate::repository::permissions::PermissionNames::*;
#[derive(Serialize, Debug)]
pub struct ResultResponseData<T> {
    pub data: T,
    pub query: String,
}

#[has_permissions["QuestionShow", type = "PermissionNames"]]
pub(crate) async fn results(
    pool: web::Data<Arc<DBPool>>,
    payload: web::Json<config::QuestionHumanSql>,
    connection_pools: web::Data<Arc<Mutex<results::ConnectionPools>>>,
    req: HttpRequest,
) -> impl Responder {
    // let conn = pool.get();
    let conn = pool.get();

    let current_user_id = get_current_user_id(&req);
    let current_users_org = get_current_user_ord_id(&req);
    let mut conn_pools = Arc::clone(&*connection_pools.into_inner());
    fetch(
        &mut conn.unwrap(),
        payload.into_inner(),
        &mut conn_pools,
        current_user_id,
        current_users_org,
    )
    .await
    .map(|(d, query)| {
        HttpResponse::Ok().json(ResultResponseData {
            data: d,
            query: query.clone().to_string(),
        })
    })
    .map_err(|err| err)
    //
}

#[has_permissions["QuestionShow", type = "PermissionNames"]]
pub async fn fetch_viz_results_from_id(
    pool: web::Data<Arc<DBPool>>,
    vis_id: web::Path<i64>,
    payload: web::Json<config::QuestionHumanSql>,
    connection_pools: web::Data<Arc<Mutex<results::ConnectionPools>>>,
    req: HttpRequest,
    auth_details: AuthDetails<PermissionNames>,
) -> impl Responder {
    let conn = pool.get();
    let question_config = viz::make_question_config(
        &mut conn.unwrap(),
        vis_id.into_inner(),
        payload.into_inner(),
    )
    .unwrap();
    results(
        auth_details,
        pool,
        actix_web::web::Json(question_config),
        connection_pools,
        req,
    )
    .await
}
