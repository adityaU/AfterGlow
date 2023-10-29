use super::base;
use actix_web::{error, web, HttpResponse, Responder};

use crate::{
    controllers::common::ResponseData,
    repository::{
        models::UserSetting, models::UserSettingChangeset, models::UserSettingView, DBPool,
    },
};
use actix_web_grants::proc_macro::has_permissions;
use std::sync::Arc;

use serde::Deserialize;

#[derive(Deserialize)]
pub struct Payload {
    user_id: Option<i32>,
}

// base::generate_index!(index, UserSetting, UserSettingView, "Settings.all");
base::generate_create!(
    create,
    UserSetting,
    UserSettingChangeset,
    UserSettingView,
    "Settings.all"
);
base::generate_update!(
    update,
    UserSetting,
    UserSettingChangeset,
    UserSettingView,
    "Settings.all",
    i64
);
base::generate_show!(show, UserSetting, UserSettingView, "Settings.all", i64);

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
        .map_err(|err| error::ErrorBadRequest(err))
}
