use actix_web::{web, HttpRequest, HttpResponse, Responder};
use chrono::Utc;
use serde::{Deserialize};

use std::sync::Arc;

use crate::{
    app::{
        dashboards,
        schedule::{DashboardJobDetail, JobTypes, SchedulePayload},
    },
    controllers::{common::ResponseData, helpers::get_current_user_id},
    errors::AGError,
    repository::{
        models::{
            Dashboard, DashboardChangeset, DashboardView, Schedule, ScheduleChangeset,
        },
        DBPool,
    },
    views::dashboard::DetailedDashboardView,
};

use actix_web_grants::{permissions::AuthDetails, proc_macro::has_permissions};

use super::helpers::get_current_user_email;

#[derive(Deserialize)]
pub struct QueryParams {
    query: Option<String>,
}

pub(crate) async fn index(
    pool: web::Data<Arc<DBPool>>,
    req: HttpRequest,
    auth_details: AuthDetails,
) -> impl Responder {
    let conn = pool.get();
    let current_user_email = get_current_user_email(&req);
    let permissions = auth_details.permissions;
    Dashboard::sorted_index(&mut conn.unwrap(), current_user_email, permissions)
        .map(|items| {
            let resp = items
                .iter()
                .map(|item| DashboardView::from_model(item))
                .collect::<Vec<DashboardView>>();
            HttpResponse::Ok().json(ResponseData { data: resp })
        })
        .map_err(|err| AGError::<String>::new(err))
}

pub(crate) async fn show(
    pool: web::Data<Arc<DBPool>>,
    item_id: web::Path<i32>,
    req: HttpRequest,
    auth_details: AuthDetails,
) -> impl Responder {
    let conn = pool.get();
    let current_user_email = get_current_user_email(&req);
    let permissions = auth_details.permissions;
    Dashboard::scoped_find(
        &mut conn.unwrap(),
        item_id.into_inner(),
        current_user_email,
        permissions,
    )
    .map(|item| {
        let conn = pool.get();
        HttpResponse::Ok().json(ResponseData {
            data: DetailedDashboardView::from_model(&mut conn.unwrap(), &item),
        })
    })
    .map_err(|err| AGError::<String>::new(err))
}

#[has_permissions("Dashboard.create")]
pub(crate) async fn create(
    pool: web::Data<Arc<DBPool>>,
    data: web::Json<DashboardChangeset>,
    req: HttpRequest,
) -> impl Responder {
    let conn = pool.get();
    let current_user_id = get_current_user_id(&req);
    dashboards::create(&mut conn.unwrap(), &mut data.into_inner(), current_user_id)
        .map(|item| HttpResponse::Created().json(ResponseData { data: item }))
        .map_err(|err| AGError::<String>::new(err))
}
#[has_permissions("Dashboard.edit")]
pub(crate) async fn update(
    pool: web::Data<Arc<DBPool>>,
    data: web::Json<DashboardChangeset>,
    dashboard_id: web::Path<i32>,
) -> impl Responder {
    let conn = pool.get();
    dashboards::update(
        &mut conn.unwrap(),
        dashboard_id.into_inner(),
        &mut data.into_inner(),
    )
    .map(|item| HttpResponse::Created().json(ResponseData { data: item }))
    .map_err(|err| AGError::<String>::new(err))
}

#[has_permissions("Dashboard.edit")]
pub(crate) async fn save_schedule(
    pool: web::Data<Arc<DBPool>>,
    data: web::Json<SchedulePayload>,
    dashboard_id: web::Path<i32>,
) -> impl Responder {
    let sc = ScheduleChangeset {
        every: Some(data.every),
        time_unit: Some(data.time_unit.clone()),
        subject: Some(data.subject.clone()),
        time_details: Some(
            data.time_details
                .iter()
                .map(|x| serde_json::to_value(x).ok())
                .collect(),
        ),
        job_details: serde_json::to_value(DashboardJobDetail {
            dashboard_id: dashboard_id.clone(),
            type_: JobTypes::DashboardMailer,
        })
        .ok(),
        is_active: Some(data.is_active),
        recipients: Some(data.recipients.clone()),
        timezone: Some(data.timezone.to_string()),
        inserted_at: Utc::now().naive_utc(),
        updated_at: Utc::now().naive_utc(),
    };

    let conn = pool.get();
    Schedule::create_or_update_for_dashboard(&mut conn.unwrap(), sc, dashboard_id.into_inner())
        .map(|item| HttpResponse::Created().json(ResponseData { data: item }))
        .map_err(|err| AGError::<String>::new(err))
}

pub(crate) async fn fetch_schedule(
    pool: web::Data<Arc<DBPool>>,
    dashboard_id: web::Path<i32>,
) -> impl Responder {
    let conn = pool.get();
    Schedule::fetch_by_dashboard_id(&mut conn.unwrap(), dashboard_id.into_inner())
        .map(|item| HttpResponse::Ok().json(ResponseData { data: item.get(0) }))
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
    Dashboard::search(
        &mut conn.unwrap(),
        qp.query.clone().unwrap_or_default().as_str(),
        current_user_email,
        permissions,
    )
    .map(|items| HttpResponse::Ok().json(ResponseData { data: items }))
    .map_err(|err| AGError::<String>::new(err))
}
