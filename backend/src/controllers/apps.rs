use crate::app::apps;
use crate::controllers::common::ResponseData;
use crate::errors::AGError;
use crate::repository::permissions::PermissionNames;
use crate::repository::permissions::PermissionNames::*;
use crate::repository::DBPool;
use actix_web::{web, HttpResponse, Responder};
use actix_web_grants::proc_macro::has_permissions;
use chrono::Utc;
use common::models::{app::AppView, app_table::AppTableView};
use serde::Deserialize;
use std::sync::Arc;

use apps::tables::CreatePayload as TableCreatePayload;

#[derive(Deserialize)]
pub struct CreatePayload {
    pub name: String,
    pub description: Option<String>,
}

#[has_permissions["SettingsAll",type = "PermissionNames"]]
pub(crate) async fn create(
    pool: web::Data<Arc<DBPool>>,
    data: web::Json<CreatePayload>,
) -> impl Responder {
    let conn = pool.get();
    apps::create(&mut conn.unwrap(), data.into_inner())
        .map(|item| {
            HttpResponse::Created().json(ResponseData {
                data: AppView::from_model(&item),
            })
        })
        .map_err(AGError::<String>::new)
}

//function to get all apps
// #[has_permissions["SettingsAll",type = "PermissionNames"]]
pub(crate) async fn index(pool: web::Data<Arc<DBPool>>) -> impl Responder {
    let conn = pool.get();
    apps::index(&mut conn.unwrap())
        .map(|items| {
            let resp = items
                .iter()
                .map(|item| AppView::from_model(item))
                .collect::<Vec<AppView>>();
            HttpResponse::Ok().json(ResponseData { data: resp })
        })
        .map_err(AGError::<String>::new)
}

pub(crate) async fn show(pool: web::Data<Arc<DBPool>>, app_id: web::Path<i32>) -> impl Responder {
    let conn = pool.get();
    apps::find(&mut conn.unwrap(), app_id.into_inner())
        .map(|item| {
            HttpResponse::Ok().json(ResponseData {
                data: AppView::from_model(&item),
            })
        })
        .map_err(AGError::<String>::new)
}

pub(crate) async fn find_tables_by_app_id(
    pool: web::Data<Arc<DBPool>>,
    app_id: web::Path<i32>,
) -> impl Responder {
    let conn = pool.get();
    apps::tables::find_by_app_id(&mut conn.unwrap(), app_id.into_inner())
        .map(|items| {
            let resp = items
                .iter()
                .map(|item| AppTableView::from_model(item))
                .collect::<Vec<AppTableView>>();
            HttpResponse::Ok().json(ResponseData { data: resp })
        })
        .map_err(AGError::<String>::new)
}

pub(crate) async fn create_table(
    pool: web::Data<Arc<DBPool>>,
    payload: web::Json<TableCreatePayload>,
) -> impl Responder {
    let conn = pool.get();
    apps::tables::create(&mut conn.unwrap(), payload.into_inner())
        .map(|item| {
            HttpResponse::Created().json(ResponseData {
                data: AppTableView::from_model(&item),
            })
        })
        .map_err(AGError::<String>::new)
}

pub(crate) async fn create_column(
    pool: web::Data<Arc<DBPool>>,
    payload: web::Json<apps::columns::CreatePayload>,
) -> impl Responder {
    let conn = pool.get();
    apps::columns::create(&mut conn.unwrap(), &payload.into_inner())
        .map(|item| HttpResponse::Created().json(ResponseData { data: item }))
        .map_err(AGError::<String>::new)
}

pub(crate) async fn find_columns_by_table_id(
    pool: web::Data<Arc<DBPool>>,
    table_id: web::Path<i64>,
) -> impl Responder {
    let conn = pool.get();
    apps::columns::find_by_table_id(&mut conn.unwrap(), table_id.into_inner())
        .map(|items| HttpResponse::Ok().json(ResponseData { data: items }))
        .map_err(AGError::<String>::new)
}
