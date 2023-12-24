use std::{sync::Arc};

use super::{
    base,
    helpers::{get_current_user_email, get_current_user_id, get_current_user_ord_id},
};
use actix_web::http::StatusCode;
use actix_web::{web, HttpRequest, HttpResponse, Responder};
use chrono::Utc;
use serde::Deserialize;

use crate::{
    app::{
        bg_jobs::{jobs::send_csv::SendCSVJob, pg_queue::PostgresQueue, Queue},
        questions::config,
        schedule::{JobTypes, SchedulePayload, VisualizationJobDetail},
        settings::reports::{is_download_allowed, is_report_config_complete},
    },
    controllers::common::ResponseData,
    errors::AGError,
    repository::{
        models::Visualization,
        models::{Schedule, VisualizationChangeset},
        models::{ScheduleChangeset, VisualizationView},
        DBPool,
    },
    response_text::{DOWNLOAD_NOT_ALLOWED, DOWNLOAD_SUCCESS, REPORTS_NOT_SET_FAILURE},
    views::{
        visualization_mailer_schedule::VisualizationMailerScheduleView,
        visualizations::SearchVisualizationsView,
    },
};
use actix_web_grants::{permissions::AuthDetails, proc_macro::has_permissions};

#[derive(Deserialize)]
pub struct QueryParams {
    team_id: Option<i32>,
}

#[derive(Deserialize)]
pub struct SearchQueryParams {
    q: Option<String>,
}

base::generate_index!(index, Visualization, VisualizationView, "Any");
base::generate_create!(
    create,
    Visualization,
    VisualizationChangeset,
    VisualizationView,
    "Settings.all"
);
base::generate_update!(
    update,
    Visualization,
    VisualizationChangeset,
    VisualizationView,
    "Settings.all",
    i64
);

#[has_permissions("Any")]
pub(crate) async fn show(
    pool: web::Data<Arc<DBPool>>,
    item_id: web::Path<i64>,
    req: HttpRequest,
    auth_details: AuthDetails,
) -> impl Responder {
    let conn = pool.get();
    let permissions = auth_details.permissions;
    let current_user_email = get_current_user_email(&req);
    Visualization::find_scoped(
        &mut conn.unwrap(),
        item_id.into_inner(),
        current_user_email,
        permissions,
    )
    .map(|item| {
        HttpResponse::Ok().json(ResponseData {
            data: VisualizationView::from_model(&item),
        })
    })
    .map_err(|err| AGError::<String>::new_with_details(err, None, StatusCode::NOT_FOUND))
}

pub(crate) async fn create_csv(
    pool: web::Data<Arc<DBPool>>,
    payload: web::Json<config::QuestionHumanSql>,
    pg_queue: web::Data<Arc<PostgresQueue>>,
    req: HttpRequest,
) -> impl Responder {
    let pg_queue = Arc::clone(&*pg_queue.into_inner());

    let current_user_email = get_current_user_email(&req);

    let conn = pool.get();

    let current_user_id = get_current_user_id(&req);
    let current_users_org = get_current_user_ord_id(&req);

    if !is_report_config_complete(&mut conn.unwrap()) {
        return Err(AGError::<String>::new(REPORTS_NOT_SET_FAILURE.to_string()));
    }

    let conn = pool.get();

    if !is_download_allowed(&mut conn.unwrap(), current_user_id, current_users_org) {
        return Err(AGError::<String>::new(DOWNLOAD_NOT_ALLOWED.to_string()));
    }

    let job = SendCSVJob {
        email: current_user_email,
        payload: payload.into_inner(),
        user_id: current_user_id,
        org_id: current_users_org,
    };

    pg_queue
        .push(crate::app::bg_jobs::Message::SendCSV(job), None)
        .await
        .map(|_| {
            HttpResponse::Ok().json(ResponseData {
                data: DOWNLOAD_SUCCESS,
            })
        })
        .map_err(|err| AGError::<String>::new(err))
}

pub(crate) async fn search(
    pool: web::Data<Arc<DBPool>>,
    req: HttpRequest,
    qp: web::Query<SearchQueryParams>,
    auth_details: AuthDetails,
) -> impl Responder {
    let conn = pool.get();

    let permissions = auth_details.permissions;
    let current_user_email = get_current_user_email(&req);
    Visualization::search(
        &mut conn.unwrap(),
        qp.into_inner().q.unwrap_or_default(),
        current_user_email,
        permissions,
    )
    .map(|res| {
        HttpResponse::Ok().json(ResponseData {
            data: res
                .iter()
                .map(|qv| SearchVisualizationsView::from_model(qv))
                .collect::<Vec<SearchVisualizationsView>>(),
        })
    })
    .map_err(|err| AGError::<String>::new(err))
}

#[has_permissions("Question.edit")]
pub(crate) async fn save_schedule(
    pool: web::Data<Arc<DBPool>>,
    data: web::Json<SchedulePayload>,
    visualization_id: web::Path<i64>,
) -> impl Responder {
    let sc = ScheduleChangeset {
        every: Some(data.every),
        time_unit: Some(data.time_unit.clone()),
        time_details: Some(
            data.time_details
                .iter()
                .map(|x| serde_json::to_value(x).ok())
                .collect(),
        ),
        job_details: serde_json::to_value(VisualizationJobDetail {
            visualization_id: visualization_id.clone(),
            type_: JobTypes::VisualizationMailer,
            email_content: data.email_content.clone(),
        })
        .ok(),
        is_active: Some(data.is_active),
        recipients: Some(data.recipients.clone()),
        timezone: Some(data.timezone.to_string()),
        subject: Some(data.subject.clone()),
        inserted_at: Utc::now().naive_utc(),
        updated_at: Utc::now().naive_utc(),
    };

    let conn = pool.get();
    Schedule::create_or_update_for_visualization(
        &mut conn.unwrap(),
        sc,
        visualization_id.into_inner(),
    )
    .map(|item| {
        HttpResponse::Created().json(ResponseData {
            data: VisualizationMailerScheduleView::from_model(Some(&item)),
        })
    })
    .map_err(|err| AGError::<String>::new(err))
}

#[has_permissions("Question.edit")]
pub(crate) async fn fetch_schedule(
    pool: web::Data<Arc<DBPool>>,
    visualization_id: web::Path<i64>,
) -> impl Responder {
    let conn = pool.get();
    Schedule::fetch_by_visualization_id(&mut conn.unwrap(), visualization_id.into_inner())
        .map(|item| {
            HttpResponse::Ok().json(ResponseData {
                data: VisualizationMailerScheduleView::from_model(item.get(0)),
            })
        })
        .map_err(|err| AGError::<String>::new(err))
}
