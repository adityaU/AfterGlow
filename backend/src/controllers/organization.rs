use actix_web::{web, HttpResponse, Responder};

use super::base;
use actix_web::http::StatusCode;
use std::sync::Arc;

use crate::errors::AGError;
use crate::repository::models::{Organization, OrganizationChangeset, OrganizationView};
use crate::{controllers::common::ResponseData, repository::DBPool};

use actix_web_grants::proc_macro::has_permissions;

use crate::repository::permissions::PermissionNames;
use crate::repository::permissions::PermissionNames::*;

#[has_permissions["SettingsAll", type = "PermissionNames"]]
pub(crate) async fn index(pool: web::Data<Arc<DBPool>>) -> impl Responder {
    let conn = pool.get();
    Organization::sorted_index(&mut conn.unwrap())
        .map(|items| {
            let resp = items
                .iter()
                .map(|item| OrganizationView::from_model(item))
                .collect::<Vec<OrganizationView>>();
            HttpResponse::Ok().json(ResponseData { data: resp })
        })
        .map_err(|err| AGError::<String>::new(err))
}
#[has_permissions["SettingsAll", type = "PermissionNames"]]
pub(crate) async fn create(
    pool: web::Data<Arc<DBPool>>,
    data: web::Json<OrganizationChangeset>,
) -> impl Responder {
    let conn = pool.get();
    Organization::create_with_default_settings(&mut conn.unwrap(), data.into_inner())
        .map(|item| {
            HttpResponse::Created().json(ResponseData {
                data: OrganizationView::from_model(&item),
            })
        })
        .map_err(|err| AGError::<String>::new(err))
}
#[has_permissions["SettingsAll", type = "PermissionNames"]]
pub(crate) async fn update(
    pool: web::Data<Arc<DBPool>>,
    data: web::Json<OrganizationChangeset>,
    item_id: web::Path<i64>,
) -> impl Responder {
    let conn = pool.get();
    Organization::update_with_default_settings(
        &mut conn.unwrap(),
        item_id.into_inner(),
        data.into_inner(),
    )
    .map(|item| {
        HttpResponse::Ok().json(ResponseData {
            data: OrganizationView::from_model(&item),
        })
    })
    .map_err(|err| AGError::<String>::new(err))
}
base::generate_show!(show, Organization, OrganizationView, "SettingsAll", i64);
