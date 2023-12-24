use actix_web::{web, HttpResponse, Responder};

use super::base;
use actix_web::http::StatusCode;
use std::sync::Arc;

use crate::errors::AGError;
use crate::repository::models::{Organization, OrganizationChangeset, OrganizationView};
use crate::{controllers::common::ResponseData, repository::DBPool};

use actix_web_grants::proc_macro::has_permissions;

#[has_permissions("Settings.all")]
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
base::generate_create!(
    create,
    Organization,
    OrganizationChangeset,
    OrganizationView,
    "Settings.all"
);
base::generate_update!(
    update,
    Organization,
    OrganizationChangeset,
    OrganizationView,
    "Settings.all",
    i64
);
base::generate_show!(show, Organization, OrganizationView, "Settings.all", i64);
