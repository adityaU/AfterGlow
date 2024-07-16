use std::sync::Arc;

use crate::repository::permissions::PermissionNames;
use crate::repository::permissions::PermissionNames::*;
use crate::{
    controllers::common::ResponseData,
    errors::AGError,
    repository::{models::SystemVariable, DBPool},
    views::system_variable::SystemVariableView,
};
use actix_web::{web, HttpResponse, Responder};
use actix_web_grants::proc_macro::has_permissions;
use serde::Deserialize;

#[derive(Deserialize)]
pub struct SystemVariablePayload {
    pub name: String,
    pub value: String,
}

#[has_permissions["SettingsAll", type = "PermissionNames"]]
pub(crate) async fn index(pool: web::Data<Arc<DBPool>>) -> impl Responder {
    let conn = pool.get();
    SystemVariable::index(&mut conn.unwrap())
        .map(|items| {
            let resp = items
                .iter()
                .map(|item| SystemVariableView::from_model(item))
                .collect::<Vec<SystemVariableView>>();
            HttpResponse::Ok().json(ResponseData { data: resp })
        })
        .map_err(|err| AGError::<String>::new(err))
}
#[has_permissions["SettingsAll", type = "PermissionNames"]]
pub(crate) async fn create(
    pool: web::Data<Arc<DBPool>>,
    data: web::Json<SystemVariablePayload>,
) -> impl Responder {
    let conn = pool.get();
    let payload = data.into_inner();
    SystemVariable::create(&mut conn.unwrap(), payload.name, payload.value)
        .map(|item| {
            HttpResponse::Created().json(ResponseData {
                data: SystemVariableView::from_model(&item),
            })
        })
        .map_err(|err| AGError::<String>::new(err))
}
#[has_permissions["SettingsAll", type = "PermissionNames"]]
pub(crate) async fn update(
    pool: web::Data<Arc<DBPool>>,
    data: web::Json<SystemVariablePayload>,
    item_id: web::Path<i64>,
) -> impl Responder {
    let conn = pool.get();
    let payload = data.into_inner();
    SystemVariable::update(
        &mut conn.unwrap(),
        item_id.into_inner(),
        payload.name,
        payload.value,
    )
    .map(|item| {
        HttpResponse::Ok().json(ResponseData {
            data: SystemVariableView::from_model(&item),
        })
    })
    .map_err(|err| AGError::<String>::new(err))
}
