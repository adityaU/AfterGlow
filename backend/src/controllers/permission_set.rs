use actix_web::{web, HttpResponse, Responder};

use super::base;

use std::sync::Arc;

use crate::errors::AGError;
use crate::repository::models::{
    PermissionSet, PermissionSetChangeset, PermissionSetView, UserPermissionSet,
    UserPermissionSetView,
};
use crate::{controllers::common::ResponseData, repository::DBPool};

use serde::Deserialize;

use crate::repository::permissions::PermissionNames;
use crate::repository::permissions::PermissionNames::*;
use actix_web_grants::proc_macro::has_permissions;

#[derive(Debug, Deserialize)]
pub struct Payload {
    user_id: Option<i64>,
    permission_set_id: Option<i64>,
}

base::generate_update!(
    update,
    PermissionSet,
    PermissionSetChangeset,
    PermissionSetView,
    "SettingsAll"
);

#[has_permissions["SettingsAll", type = "PermissionNames"]]
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
        .map_err(|err| AGError::<String>::new(err))
}

#[has_permissions["SettingsAll", type = "PermissionNames"]]
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
        .map_err(|err| AGError::<String>::new(err))
}
