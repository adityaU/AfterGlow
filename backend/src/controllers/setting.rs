use actix_web::{error, web, HttpResponse, Responder};

use super::base;
use std::sync::Arc;

use crate::app::settings::init_config;
use crate::repository::models::{Setting, SettingChangeset, SettingView};
use crate::{controllers::common::ResponseData, repository::DBPool};

use serde::Deserialize;

use actix_web_grants::proc_macro::has_permissions;

use crate::repository::permissions::PermissionNames;
use crate::repository::permissions::PermissionNames::*;
#[derive(Deserialize)]
pub struct QueryParams {
    organization_id: Option<i64>,
}

use crate::errors::AGError;

base::generate_index!(index, Setting, SettingView, "SettingsAll");

base::generate_create!(
    create,
    Setting,
    SettingChangeset,
    SettingView,
    "SettingsAll"
);
base::generate_update!(
    update,
    Setting,
    SettingChangeset,
    SettingView,
    "SettingsAll"
);
base::generate_show!(show, Setting, SettingView, "SettingsAll");

pub async fn init_config(
    pool: web::Data<Arc<DBPool>>,
    _query: web::Query<QueryParams>,
) -> impl Responder {
    let conn = pool.get();
    init_config::get(&mut conn.unwrap())
        .map(|resp| HttpResponse::Ok().json(ResponseData { data: resp }))
        .map_err(|err| error::ErrorBadRequest(err))
}
