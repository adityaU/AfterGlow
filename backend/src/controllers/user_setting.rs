use super::base;
use actix_web::{web, HttpResponse, Responder};

use actix_web::http::StatusCode;

use crate::{
    controllers::common::ResponseData,
    errors::AGError,
    repository::{
        models::UserSetting, models::UserSettingChangeset, models::UserSettingView, DBPool,
    },
};
use actix_web_grants::proc_macro::has_permissions;
use std::sync::Arc;

use serde::Deserialize;

use crate::repository::permissions::PermissionNames;
use crate::repository::permissions::PermissionNames::*;
#[derive(Deserialize)]
pub struct Payload {
    user_id: Option<i64>,
}

// base::generate_index!(index, UserSetting, UserSettingView, "Settings.all");
base::generate_create!(
    create,
    UserSetting,
    UserSettingChangeset,
    UserSettingView,
    "SettingsAll"
);
base::generate_update!(
    update,
    UserSetting,
    UserSettingChangeset,
    UserSettingView,
    "SettingsAll",
    i64
);
base::generate_show!(show, UserSetting, UserSettingView, "SettingsAll", i64);

#[has_permissions["SettingsAll", type = "PermissionNames"]]
pub(crate) async fn index(
    pool: web::Data<Arc<DBPool>>,
    params: web::Query<Payload>,
) -> impl Responder {
    let conn = pool.get();
    let user_settings = if params.user_id.unwrap_or(0) != 0 {
        UserSetting::find_by_user_id(&mut conn.unwrap(), params.user_id.unwrap())
    } else {
        UserSetting::index(&mut conn.unwrap())
    };
    user_settings
        .map(|user_settings| {
            let resp = user_settings
                .iter()
                .map(|user_setting| UserSettingView::from_model(user_setting))
                .collect::<Vec<UserSettingView>>();
            HttpResponse::Ok().json(ResponseData { data: resp })
        })
        .map_err(|err| AGError::<String>::new(err))
}
