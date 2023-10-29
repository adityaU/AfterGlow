use actix_web::{error, web, HttpResponse, Responder};
use serde::Deserialize;

use std::sync::Arc;

use crate::{
    controllers::common::ResponseData,
    repository::{
        models::{Dashboard, DashboardView},
        DBPool,
    },
    views::dashboard::DetailedDashboardView,
};

// constanrt hashmap that has method to permissions mapping

#[derive(Deserialize)]
pub struct QueryParams {
    team_id: Option<i32>,
}

pub(crate) async fn index(pool: web::Data<Arc<DBPool>>) -> impl Responder {
    let conn = pool.get();
    Dashboard::sorted_index(&mut conn.unwrap())
        .map(|items| {
            let resp = items
                .iter()
                .map(|item| DashboardView::from_model(item))
                .collect::<Vec<DashboardView>>();
            HttpResponse::Ok().json(ResponseData { data: resp })
        })
        .map_err(|err| error::ErrorBadRequest(err))
}

pub(crate) async fn show(pool: web::Data<Arc<DBPool>>, item_id: web::Path<i32>) -> impl Responder {
    let conn = pool.get();
    Dashboard::find(&mut conn.unwrap(), item_id.into_inner())
        .map(|item| {
            let conn = pool.get();
            HttpResponse::Ok().json(ResponseData {
                data: DetailedDashboardView::from_model(&mut conn.unwrap(), &item),
            })
        })
        .map_err(|err| error::ErrorBadRequest(err))
}
