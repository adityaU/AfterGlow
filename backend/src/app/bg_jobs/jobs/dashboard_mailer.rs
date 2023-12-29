use std::{fmt, sync::Arc};

use diesel::PgConnection;
use serde::{Deserialize, Serialize};

use crate::app::bg_jobs::{Error as BGJobError, JobEssentials, LongLivedData};

#[derive(Debug, Serialize, Deserialize)]
pub enum DashboardMailerError {
    NoSystemUser(String),
    UnableToMakeDefaultPayload(String),
    CouldNotFindDashboard(String),
    InvalidSettings(String),
}

impl fmt::Display for DashboardMailerError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            DashboardMailerError::NoSystemUser(msg) => {
                write!(f, "No system user found: {}", msg)
            }
            DashboardMailerError::UnableToMakeDefaultPayload(msg) => {
                write!(f, "Unable to make default payload: {}", msg)
            }
            DashboardMailerError::CouldNotFindDashboard(msg) => {
                write!(f, "Could not find dashboard: {}", msg)
            }
            DashboardMailerError::InvalidSettings(msg) => {
                write!(f, "Invalid Dashboard Settings: {}", msg)
            }
        }
    }
}

impl std::error::Error for DashboardMailerError {}
impl From<DashboardMailerError> for BGJobError {
    fn from(dashboard_mailer_error: DashboardMailerError) -> Self {
        BGJobError::ScheduledDashboardMailerError(dashboard_mailer_error)
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct DashboardMailerJob {
    pub recipients: Vec<String>,
    pub dashboard_id: i64,
}

#[async_trait::async_trait]
impl JobEssentials for DashboardMailerJob {
    async fn execute(&self, _data: Arc<LongLivedData>) -> Result<(), BGJobError> {
        todo!()
        // let dashboard = Dashboard::find(&mut data.pool.get().unwrap(), self.dashboard_id)
        //     .map_err(|err| DashboardMailerError::CouldNotFindDashboard(err.to_string()))?;
        //
        // let settings: Settings = serde_json::from_value(dashboard.settings.clone().unwrap())
        //     .map_err(|err| DashboardMailerError::InvalidSettings(err.to_string()))?;
        // let conn = data.pool.get();
        // settings.widgets.iter().map(|wid| async {
        //     match wid.type_ {
        //         WidgetTypes::Note => Self::make_note_html(&mut conn.unwrap(), wid.wid_id).await,
        //         WidgetTypes::Visualization => {
        //             Self::make_visualization_html(&mut conn.unwrap(), wid.wid_id).await
        //         }
        //         _ => "".to_string(),
        //     }
        // })
    }
}

impl DashboardMailerJob {
    async fn make_note_html(_conn: &mut PgConnection, _note_id: i64) -> String {
        todo!()
    }

    async fn make_visualization_html(_conn: &mut PgConnection, _viz_id: i64) -> String {
        todo!()
        // match Visualization::find(conn, viz_id) {
        //     Ok(viz) => todo!(),
        //     Err(Err) => todo!(),
        // }
    }
}
