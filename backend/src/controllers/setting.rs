
use actix_web::{error, web, HttpResponse, Responder};

use super::base;
use std::sync::Arc;

use crate::repository::models::{Setting, SettingChangeset, SettingView};
use crate::{controllers::common::ResponseData, repository::DBPool};

use serde::Deserialize;

use actix_web_grants::proc_macro::has_permissions;

#[derive(Deserialize)]
pub struct QueryParams {
    organization_id: Option<i64>,
}

use crate::errors::AGError;

base::generate_index!(index, Setting, SettingView, "Settings.all");

base::generate_create!(
    create,
    Setting,
    SettingChangeset,
    SettingView,
    "Settings.all"
);
base::generate_update!(
    update,
    Setting,
    SettingChangeset,
    SettingView,
    "Settings.all"
);
base::generate_show!(show, Setting, SettingView, "Settings.all");
