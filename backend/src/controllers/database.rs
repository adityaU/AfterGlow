use actix_web::{error, web, HttpResponse, Responder};
use serde::Deserialize;

use super::base;
use crate::views::database::DatabaseView;
use crate::{
    controllers::common::ResponseData,
    repository::{models::Database, models::DatabaseChangeset, DBPool},
};
use std::sync::Arc;

use actix_web_grants::proc_macro::has_permissions;
// constanrt hashmap that has method to permissions mapping

#[derive(Deserialize)]
pub struct QueryParams {
    team_id: Option<i32>,
}

// base::generate_index!(index, Database, DatabaseView, "Any");
base::generate_create!(
    create,
    Database,
    DatabaseChangeset,
    DatabaseView,
    "Settings.all"
);
base::generate_update!(
    update,
    Database,
    DatabaseChangeset,
    DatabaseView,
    "Settings.all"
);
base::generate_show!(show, Database, DatabaseView, "Settings.all");

pub(crate) async fn index(
    pool: web::Data<Arc<DBPool>>,
    params: web::Query<QueryParams>,
) -> impl Responder {
    let team_id = params.team_id.unwrap_or(0);

    let conn = pool.get();
    let users = if team_id == 0 {
        Database::sorted_index(&mut conn.unwrap())
    } else {
        Database::find_by_team_id(&mut conn.unwrap(), team_id)
    };
    users
        .map(|dbs| {
            let resp = dbs
                .iter()
                .map(|db| DatabaseView::from_model(db))
                .collect::<Vec<DatabaseView>>();
            HttpResponse::Ok().json(ResponseData { data: resp })
        })
        .map_err(|err| error::ErrorBadRequest(err))
}

// pub(crate) async fn index(pool: web::Data<DBPool>) -> impl Responder {
//     let conn = pool.get();
//     Database::index(&mut conn.unwrap())
//         .map(|databases| {
//             let resp = databases
//                 .iter()
//                 .map(|db| DatabaseView::from_model(db))
//                 .collect::<Vec<DatabaseView>>();
//             HttpResponse::Ok().json(ResponseData { data: resp })
//         })
//         .map_err(|err| error::ErrorBadRequest(err))
// }

// #[has_permissions("Settings.all")]
// pub(crate) async fn create(
//     pool: web::Data<DBPool>,
//     data: web::Json<DatabaseChangeset>,
// ) -> impl Responder {
//     let conn = pool.get();
//     Database::create(&mut conn.unwrap(), data.into_inner())
//         .map(|database| match verify_connection(&database) {
//             true => HttpResponse::Ok().json(ResponseData { data: &database }),
//             false => HttpResponse::BadRequest().json(AGError::<String>::new(
//                 "Could not connect to database with given parameters",
//             )),
//         })
//         .map_err(|err| error::ErrorBadRequest(err))
// }

// #[has_permissions("Settings.all")]
// pub(crate) async fn update(
//     pool: web::Data<DBPool>,
//     data: web::Json<DatabaseChangeset>,
//     database_id: web::Path<i32>,
// ) -> impl Responder {
//     let conn = pool.get();
//     Database::update(
//         &mut conn.unwrap(),
//         database_id.into_inner(),
//         data.into_inner(),
//     )
//     .map(|database| match verify_connection(&database) {
//         true => HttpResponse::Ok().json(ResponseData { data: &database }),
//         false => HttpResponse::BadRequest().json(AGError::<String>::new(
//             "Could not connect to database with given parameters",
//         )),
//     })
//     .map_err(|err| error::ErrorBadRequest(err))
// }

// #[has_permissions("Settings.all")]
// pub(crate) async fn show(pool: web::Data<DBPool>, database_id: web::Path<i32>) -> impl Responder {
//     let conn = pool.get();
//     Database::find(&mut conn.unwrap(), database_id.into_inner())
//         .map(|databases| HttpResponse::Ok().json(ResponseData { data: databases }))
//         .map_err(|err| error::ErrorBadRequest(err))
// }
