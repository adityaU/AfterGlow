use actix_web::{web, HttpResponse, Responder};

use super::base;
use std::sync::Arc;

use crate::errors::AGError;
use crate::repository::models::{
    OrganizationSetting, OrganizationSettingChangeset, OrganizationSettingView,
};
use crate::{controllers::common::ResponseData, repository::DBPool};
use actix_web::http::StatusCode;

use serde::Deserialize;

use actix_web_grants::proc_macro::has_permissions;

#[derive(Deserialize)]
pub struct QueryParams {
    organization_id: Option<i64>,
}

#[has_permissions("Settings.all")]
pub(crate) async fn index(
    pool: web::Data<Arc<DBPool>>,
    params: web::Query<QueryParams>,
) -> impl Responder {
    let conn = pool.get();

    let organization_id = params.organization_id.unwrap_or(0);

    OrganizationSetting::find_by_org_id(&mut conn.unwrap(), organization_id)
        .map(|items| {
            let resp = items
                .iter()
                .map(|item| OrganizationSettingView::from_model(item))
                .collect::<Vec<OrganizationSettingView>>();
            HttpResponse::Ok().json(ResponseData { data: resp })
        })
        .map_err(|err| AGError::<String>::new(err))
}

base::generate_create!(
    create,
    OrganizationSetting,
    OrganizationSettingChangeset,
    OrganizationSettingView,
    "Settings.all"
);
base::generate_update!(
    update,
    OrganizationSetting,
    OrganizationSettingChangeset,
    OrganizationSettingView,
    "Settings.all",
    i64
);
base::generate_show!(
    show,
    OrganizationSetting,
    OrganizationSettingView,
    "Settings.all",
    i64
);
