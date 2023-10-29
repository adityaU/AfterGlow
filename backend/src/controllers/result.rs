use std::sync::{Arc, Mutex};

use actix_web::{error, web, HttpRequest, HttpResponse, Responder};
use serde::{Deserialize, Deserializer, Serialize};

use crate::{
    app::{
        questions::config,
        results::{self, fetch},
        visualizations::viz,
    },
    repository::DBPool,
};

use super::common::ResponseData;

#[derive(Serialize, Debug)]
pub struct ResultResponseData<T> {
    pub data: T,
    pub query: String,
}

pub(crate) async fn results(
    pool: web::Data<Arc<DBPool>>,
    payload: web::Json<config::QuestionConfig>,
    connection_pools: web::Data<Arc<Mutex<results::ConnectionPools>>>,
    req: HttpRequest,
) -> impl Responder {
    // let conn = pool.get();
    let conn = pool.get();

    let current_user_id = req
        .headers()
        .get("user_id")
        .unwrap()
        .to_str()
        .unwrap()
        .parse::<i32>()
        .ok()
        .unwrap_or(0);
    let current_users_org = req
        .headers()
        .get("organization_id")
        .unwrap()
        .to_str()
        .unwrap()
        .parse::<i64>()
        .ok()
        .unwrap_or(0);
    let mut conn_pools = Arc::clone(&*connection_pools.into_inner());
    fetch(
        &mut conn.unwrap(),
        payload.into_inner(),
        &mut conn_pools,
        current_user_id,
        current_users_org,
    )
    .await
    .map(|(d, query)| HttpResponse::Ok().json(ResultResponseData { data: d, query }))
    .map_err(|err| err)
    //
}

pub async fn fetch_viz_results_from_id(
    pool: web::Data<Arc<DBPool>>,
    vis_id: web::Path<i64>,
    payload: web::Json<config::QuestionConfig>,
    connection_pools: web::Data<Arc<Mutex<results::ConnectionPools>>>,
    req: HttpRequest,
) -> impl Responder {
    let conn = pool.get();
    let question_config = viz::make_question_config(
        &mut conn.unwrap(),
        vis_id.into_inner(),
        payload.into_inner(),
    )
    .unwrap();
    results(
        pool,
        actix_web::web::Json(question_config),
        connection_pools,
        req,
    )
    .await
}
