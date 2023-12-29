use super::base;

use actix_web::{error, web, HttpResponse, Responder};
use serde::Deserialize;

use crate::{
    controllers::common::ResponseData,
    errors::AGError,
    repository::{models::User, models::UserChangeset, models::UserView, DBPool},
    views::user::RestrictedUserView,
};
use actix_web_grants::proc_macro::has_permissions;
use std::sync::Arc;

#[derive(Deserialize)]
pub struct QueryParams {
    team_id: Option<i64>,
    query: Option<String>,
}

base::generate_index!(_index, User, UserView, "Any");
base::generate_create!(create, User, UserChangeset, UserView, "Settings.all");
base::generate_update!(update, User, UserChangeset, UserView, "Settings.all");
base::generate_show!(show, User, UserView, "Settings.all");

#[derive(Deserialize)]
pub struct Payload {
    emails: Vec<String>,
    ps_id: i64,
}

pub(crate) async fn index(
    pool: web::Data<Arc<DBPool>>,
    params: web::Query<QueryParams>,
) -> impl Responder {
    let team_id = params.team_id.unwrap_or(0);

    let conn = pool.get();
    let users = if team_id == 0 {
        User::sorted_index(&mut conn.unwrap())
    } else {
        User::find_by_team_id(&mut conn.unwrap(), team_id)
    };
    users
        .map(|users| {
            let resp = users
                .iter()
                .map(|user| RestrictedUserView::from_model(user))
                .collect::<Vec<RestrictedUserView>>();
            HttpResponse::Ok().json(ResponseData { data: resp })
        })
        .map_err(|err| AGError::<String>::new(err))
}

pub(crate) async fn create_bulk_user(
    pool: web::Data<Arc<DBPool>>,
    params: web::Json<Payload>,
) -> impl Responder {
    let conn = pool.get();
    User::create_bulk(&mut conn.unwrap(), params.emails.clone(), params.ps_id)
        .map(|users| {
            let resp = users
                .iter()
                .filter(|res| res.is_ok())
                .map(|res| UserView::from_model(&res.as_ref().ok().unwrap()))
                .collect::<Vec<UserView>>();
            HttpResponse::Ok().json(ResponseData { data: resp })
        })
        .map_err(|err| AGError::<String>::new(err))
}

pub(crate) async fn deactivate(
    pool: web::Data<Arc<DBPool>>,
    user_id: web::Path<i64>,
) -> impl Responder {
    let conn = pool.get();
    User::deactivate(&mut conn.unwrap(), user_id.into_inner())
        .map(|user| {
            HttpResponse::Ok().json(ResponseData {
                data: RestrictedUserView::from_model(&user),
            })
        })
        .map_err(|err| AGError::<String>::new(err))
}
pub(crate) async fn activate(
    pool: web::Data<Arc<DBPool>>,
    user_id: web::Path<i64>,
) -> impl Responder {
    let conn = pool.get();
    User::activate(&mut conn.unwrap(), user_id.into_inner())
        .map(|user| {
            HttpResponse::Ok().json(ResponseData {
                data: RestrictedUserView::from_model(&user),
            })
        })
        .map_err(|err| AGError::<String>::new(err))
}

pub(crate) async fn search(
    pool: web::Data<Arc<DBPool>>,
    qp: web::Query<QueryParams>,
) -> impl Responder {
    let conn = pool.get();
    User::search(&mut conn.unwrap(), qp.query.clone().unwrap_or_default())
        .map(|items| {
            let resp = items
                .iter()
                .map(|db| UserView::from_model(db))
                .collect::<Vec<UserView>>();
            HttpResponse::Ok().json(ResponseData { data: resp })
        })
        .map_err(|err| AGError::<String>::new(err))
}
