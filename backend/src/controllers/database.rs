use actix_web::{error, web, HttpRequest, HttpResponse, Responder};
use actix_web_grants::permissions::AuthDetails;
use serde::Deserialize;

use super::base;
use super::helpers::get_current_user_email;
use crate::app::bg_jobs::jobs::sync_db::SyncDBJob;
use crate::app::bg_jobs::pg_queue::PostgresQueue;
use crate::app::bg_jobs::Queue;
use crate::errors::AGError;
use crate::response_text::SYNC_DB_JOB_TRIGGER_SUCCESS;
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
    query: Option<String>,
}

pub(crate) async fn create(
    pool: web::Data<Arc<DBPool>>,
    data: web::Json<DatabaseChangeset>,
    pg_queue: web::Data<Arc<PostgresQueue>>,
) -> impl Responder {
    let conn = pool.get();
    let resp = Database::create(&mut conn.unwrap(), data.into_inner());
    if let Err(err) = resp {
        return Err(AGError::<String>::new(err));
    }
    let resp = resp.unwrap();
    sync(resp.id.into(), pg_queue).await;
    Ok(HttpResponse::Created().json(ResponseData {
        data: DatabaseView::from_model(&resp),
    }))
}
#[has_permissions("Settings.all")]
pub(crate) async fn update(
    pool: web::Data<Arc<DBPool>>,
    data: web::Json<DatabaseChangeset>,
    item_id: web::Path<i32>,
    pg_queue: web::Data<Arc<PostgresQueue>>,
) -> impl Responder {
    let conn = pool.get();
    let resp = Database::update(&mut conn.unwrap(), item_id.into_inner(), data.into_inner());
    if let Err(err) = resp {
        return Err(AGError::<String>::new(err));
    }
    let resp = resp.unwrap();
    sync(resp.id.into(), pg_queue).await;
    Ok(HttpResponse::Ok().json(ResponseData {
        data: DatabaseView::from_model(&resp),
    }))
}
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
        .map_err(|err| AGError::<String>::new(err))
}

pub(crate) async fn sync(
    database_id: web::Path<i32>,
    pg_queue: web::Data<Arc<PostgresQueue>>,
) -> impl Responder {
    let pg_queue = Arc::clone(&*pg_queue.into_inner());
    let job = SyncDBJob {
        database_id: database_id.into_inner(),
    };
    pg_queue
        .push(crate::app::bg_jobs::Message::SyncDB(job), None)
        .await
        .map(|_| {
            HttpResponse::Ok().json(ResponseData {
                data: SYNC_DB_JOB_TRIGGER_SUCCESS,
            })
        })
        .map_err(|err| AGError::<String>::new(err))
}
pub(crate) async fn search(
    pool: web::Data<Arc<DBPool>>,
    qp: web::Query<QueryParams>,
    req: HttpRequest,
    auth_details: AuthDetails,
) -> impl Responder {
    let conn = pool.get();
    let current_user_email = get_current_user_email(&req);
    let permissions = auth_details.permissions;
    Database::search(
        &mut conn.unwrap(),
        qp.query.clone().unwrap_or_default(),
        current_user_email,
        permissions,
    )
    .map(|items| {
        let resp = items
            .iter()
            .map(|db| DatabaseView::from_model(db))
            .collect::<Vec<DatabaseView>>();
        HttpResponse::Ok().json(ResponseData { data: resp })
    })
    .map_err(|err| AGError::<String>::new(err))
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
//         .map_err(|err| AGError::<String>::new(err))
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
//         .map_err(|err| AGError::<String>::new(err))
// }

// #[has_permissions("Settings.all")]
// pub(crate) async fn update(
//     pool: web::Data<DBPool>,
//     data: web::Json<DatabaseChangeset>,
//     database_id: web::Path<i32>,
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
//     .map_err(|err| AGError::<String>::new(err))
// }

// #[has_permissions("Settings.all")]
// pub(crate) async fn show(pool: web::Data<DBPool>, database_id: web::Path<i32>) -> impl Responder {
//     let conn = pool.get();
//     Database::find(&mut conn.unwrap(), database_id.into_inner())
//         .map(|databases| HttpResponse::Ok().json(ResponseData { data: databases }))
//         .map_err(|err| AGError::<String>::new(err))
// }
