use actix_web::{error, web, HttpResponse, Responder};

use super::base;
use std::sync::Arc;

use crate::repository::models::{
    PermissionSet, PermissionSetChangeset, PermissionSetView, UserPermissionSet,
    UserPermissionSetView,
};
use crate::{controllers::common::ResponseData, repository::DBPool};

use serde::Deserialize;

use actix_web_grants::proc_macro::has_permissions;
// constanrt hashmap that has method to permissions mapping
//
//
#[derive(Debug, Deserialize)]
pub struct Payload {
    user_id: Option<i32>,
    permission_set_id: Option<i32>,
}

// base::generate_index(_index, PermissionSet, PermissionSetView, "Any");
// base::generate_create!(create, PermissionSet, PermissionSetChangeset, PermissionSetView, "Settings.all");
base::generate_update!(
    update,
    PermissionSet,
    PermissionSetChangeset,
    PermissionSetView,
    "Settings.all"
);
// base::generate_show!(show, PermissionSet, PermissionSetView, "Settings.all");

// actix controller that reads user_id from query strings and returns teams by that user
pub(crate) async fn index(
    pool: web::Data<Arc<DBPool>>,
    params: web::Query<Payload>,
) -> impl Responder {
    let conn = pool.get();
    let permission_sets = if params.user_id.unwrap_or(0) != 0 {
        PermissionSet::find_by_user_id(&mut conn.unwrap(), params.user_id.unwrap())
    } else {
        PermissionSet::index(&mut conn.unwrap())
    };
    permission_sets
        .map(|permission_sets| {
            let resp = permission_sets
                .iter()
                .map(|permission_set| PermissionSetView::from_model(permission_set))
                .collect::<Vec<PermissionSetView>>();
            HttpResponse::Ok().json(ResponseData { data: resp })
        })
        .map_err(|err| error::ErrorBadRequest(err))
}

pub(crate) async fn update_user(
    pool: web::Data<Arc<DBPool>>,
    params: web::Path<Payload>,
) -> impl Responder {
    let conn = pool.get();
    let user_id = params.user_id.unwrap_or(0);
    let permission_set_id = params.permission_set_id.unwrap_or(0);

    UserPermissionSet::create_or_update_for_user(&mut conn.unwrap(), user_id, permission_set_id)
        .map(|upss| {
            HttpResponse::Ok().json(ResponseData {
                data: UserPermissionSetView::from_model(&upss),
            })
        })
        .map_err(|err| error::ErrorBadRequest(err))
}
