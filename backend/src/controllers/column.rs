use actix_web::{web, HttpResponse, Responder};

use super::base;

use crate::repository::models::{Column, ColumnChangeset, ColumnView};

use crate::{controllers::common::ResponseData, repository::DBPool};

use std::sync::Arc;

use actix_web_grants::proc_macro::has_permissions;

use crate::errors::AGError;

base::generate_update!(update, Column, ColumnChangeset, ColumnView, "Settings.all");
