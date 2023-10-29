use std::sync::{Arc, Mutex};

use super::{base, result::results};
use actix_web::{error, web, HttpRequest, HttpResponse, Responder};
use serde::Deserialize;

use crate::{
    app::{
        bg_jobs::{jobs::send_csv::SendCSVJob, pg_queue::PostgresQueue, Queue},
        questions::config,
        results,
        settings::reports::{is_download_allowed, is_report_config_complete},
    },
    controllers::common::ResponseData,
    errors::AGError,
    repository::{
        models::Visualization, models::VisualizationChangeset, models::VisualizationView, DBPool,
    },
    response_text::{DOWNLOAD_NOT_ALLOWED, DOWNLOAD_SUCCESS, REPORTS_NOT_SET_FAILURE},
};
use actix_web_grants::proc_macro::has_permissions;

#[derive(Deserialize)]
pub struct QueryParams {
    team_id: Option<i32>,
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
base::generate_show!(show, Visualization, VisualizationView, "Settings.all", i64);

pub(crate) async fn create_csv(
    pool: web::Data<Arc<DBPool>>,
    payload: web::Json<config::QuestionConfig>,
    pg_queue: web::Data<Arc<PostgresQueue>>,
    req: HttpRequest,
) -> impl Responder {
    let pg_queue = Arc::clone(&*pg_queue.into_inner());

    let current_user_email = req
        .headers()
        .get("user_email")
        .unwrap()
        .to_str()
        .unwrap()
        .parse::<String>()
        .ok()
        .unwrap_or("".to_string());

    let conn = pool.get();

    let current_user_id = req
        .headers()
        .get("user_id")
        .unwrap()
        .to_str()
        .unwrap()
        .parse::<i32>()
        .ok()
        .unwrap_or(0);
    let current_users_org = req
        .headers()
        .get("organization_id")
        .unwrap()
        .to_str()
        .unwrap()
        .parse::<i64>()
        .ok()
        .unwrap_or(0);

    if !is_report_config_complete(&mut conn.unwrap()) {
        return Err(AGError::<String>::new(REPORTS_NOT_SET_FAILURE));
    }

    let conn = pool.get();

    if !is_download_allowed(&mut conn.unwrap(), current_user_id, current_users_org) {
        return Err(AGError::<String>::new(DOWNLOAD_NOT_ALLOWED));
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
        .map_err(|err| AGError::<String>::new(err.to_string().as_str()))
}
