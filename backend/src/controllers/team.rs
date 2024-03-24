use actix_web::{web, HttpResponse, Responder};

use super::base;
use super::common::OP_SUCCESS;
use crate::errors::AGError;
use crate::repository::models::{Team, TeamChangeset, TeamView};
use crate::views::team::PreloadedTeamView;
use crate::{controllers::common::ResponseData, repository::DBPool};

use std::sync::Arc;

use serde::Deserialize;

use crate::repository::permissions::PermissionNames;
use crate::repository::permissions::PermissionNames::*;
use actix_web_grants::proc_macro::has_permissions;
#[derive(Debug, Deserialize)]
pub struct Payload {
    user_id: Option<i64>,
    database_id: Option<i64>,
}

// base::generate_index(_index, Team, TeamView, "Any");
base::generate_create!(create, Team, TeamChangeset, TeamView, "SettingsAll");
base::generate_update!(update, Team, TeamChangeset, TeamView, "SettingsAll");
// base::generate_show!(show, Team, TeamView, "Settings.all");

// actix controller that reads user_id from query strings and returns teams by that user
#[has_permissions["SettingsAll", type = "PermissionNames"]]
pub(crate) async fn index(
    pool: web::Data<Arc<DBPool>>,
    params: web::Query<Payload>,
) -> impl Responder {
    let conn = pool.get();
    if params.user_id.unwrap_or(0) != 0 {
        let resp = Team::find_by_user_id(&mut conn.unwrap(), params.user_id.unwrap())
            .map(|teams| {
                let resp = teams
                    .iter()
                    .map(|team| TeamView::from_model(team))
                    .collect::<Vec<TeamView>>();
                HttpResponse::Ok().json(ResponseData { data: resp })
            })
            .map_err(|err| AGError::<String>::new(err));
        return resp;
    }

    let teams = Team::index(&mut conn.unwrap()).map_err(|err| AGError::<String>::new(err))?;

    let conn = pool.get();
    PreloadedTeamView::from_model_list(&mut conn.unwrap(), teams)
        .map(|teams| HttpResponse::Ok().json(ResponseData { data: teams }))
        .map_err(|err| AGError::<String>::new(err))
}

#[has_permissions["SettingsAll", type = "PermissionNames"]]
pub(crate) async fn remove_user(
    pool: web::Data<Arc<DBPool>>,
    params: web::Json<Payload>,
    team_id: web::Path<i64>,
) -> impl Responder {
    let conn = pool.get();
    let user_id = params.user_id.unwrap_or(0);
    let tid = team_id.into_inner();
    Team::remove_user(&mut conn.unwrap(), user_id, tid)
        .map(|_| HttpResponse::Ok().json(ResponseData { data: OP_SUCCESS }))
        .map_err(|err| AGError::<String>::new(err))
}

#[has_permissions["SettingsAll", type = "PermissionNames"]]
pub(crate) async fn add_user(
    pool: web::Data<Arc<DBPool>>,
    params: web::Json<Payload>,
    team_id: web::Path<i64>,
) -> impl Responder {
    let conn = pool.get();
    let user_id = params.user_id.unwrap_or(0);
    let tid = team_id.into_inner();
    Team::add_user(&mut conn.unwrap(), user_id, tid)
        .map(|_| HttpResponse::Ok().json(ResponseData { data: OP_SUCCESS }))
        .map_err(|err| AGError::<String>::new(err))
}

#[has_permissions["SettingsAll", type = "PermissionNames"]]
pub(crate) async fn remove_database(
    pool: web::Data<Arc<DBPool>>,
    params: web::Json<Payload>,
    team_id: web::Path<i64>,
) -> impl Responder {
    let conn = pool.get();
    let database_id = params.database_id.unwrap_or(0);
    let tid = team_id.into_inner();
    Team::remove_database(&mut conn.unwrap(), database_id, tid)
        .map(|_| HttpResponse::Ok().json(ResponseData { data: OP_SUCCESS }))
        .map_err(|err| AGError::<String>::new(err))
}

#[has_permissions["SettingsAll", type = "PermissionNames"]]
pub(crate) async fn add_database(
    pool: web::Data<Arc<DBPool>>,
    params: web::Json<Payload>,
    team_id: web::Path<i64>,
) -> impl Responder {
    let conn = pool.get();
    let database_id = params.database_id.unwrap_or(0);
    let tid = team_id.into_inner();
    Team::add_database(&mut conn.unwrap(), database_id, tid)
        .map(|_| HttpResponse::Ok().json(ResponseData { data: OP_SUCCESS }))
        .map_err(|err| AGError::<String>::new(err))
}