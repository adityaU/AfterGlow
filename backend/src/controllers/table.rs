use actix_web::{web, HttpResponse, Responder};

use super::base;
use std::sync::Arc;

use crate::errors::AGError;
use crate::repository::models::{Table, TableChangeset, TableView};

use crate::views::table::DetailedTableView;
use crate::{controllers::common::ResponseData, repository::DBPool};

use serde::Deserialize;

use actix_web_grants::proc_macro::has_permissions;

#[derive(Deserialize)]
pub struct QueryParams {
    database_id: Option<i64>,
    q: Option<String>,
}

// base::generate_index!(index, Setting, SettingView, "Settings.all");
//
// base::generate_create!(
//     create,
//     Setting,
//     SettingChangeset,
//     SettingView,
//     "Settings.all"
// );
base::generate_update!(update, Table, TableChangeset, TableView, "Settings.all");

pub(crate) async fn show(pool: web::Data<Arc<DBPool>>, item_id: web::Path<i64>) -> impl Responder {
    let conn = pool.get();
    Table::find(&mut conn.unwrap(), item_id.into_inner())
        .map(|item| {
            let conn = pool.get();
            HttpResponse::Ok().json(ResponseData {
                data: DetailedTableView::from_model(&mut conn.unwrap(), &item),
            })
        })
        .map_err(|err| AGError::<String>::new(err))
}
//

pub async fn search(
    pool: web::Data<Arc<DBPool>>,
    params: web::Query<QueryParams>,
) -> impl Responder {
    let conn = pool.get();
    let tables = Table::search(
        &mut conn.unwrap(),
        &params.database_id.unwrap_or(0),
        params.q.clone().unwrap_or("".to_string()),
    );
    tables
        .map(|tables| {
            let resp = tables
                .iter()
                .map(|table| TableView::from_model(table))
                .collect::<Vec<TableView>>();
            HttpResponse::Ok().json(ResponseData { data: resp })
        })
        .map_err(|err| AGError::<String>::new(err))
}
