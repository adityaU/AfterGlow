use serde::{Deserialize, Serialize};

use crate::{
    app::schedule::{TimeDetails, VisualizationJobDetail},
    repository::models::{Schedule, TimeUnit},
};

#[derive(Serialize, Deserialize)]
pub struct VisualizationMailerScheduleView {
    pub every: i32,
    pub is_active: bool,
    pub recipients: Vec<Option<String>>,
    pub time_details: Vec<Option<TimeDetails>>,
    pub time_unit: TimeUnit,
    pub timezone: String,
    pub subject: String,
    pub email_content: String,
}

impl VisualizationMailerScheduleView {
    pub fn from_model(schedule: Option<&Schedule>) -> Option<Self> {
        if schedule.is_none() {
            return None;
        }
        let schedule = schedule.unwrap();
        let job_details: Result<VisualizationJobDetail, _> =
            serde_json::from_value(schedule.job_details.clone().unwrap_or_default());
        let email_content = if let Ok(job_details) = job_details {
            job_details.email_content.unwrap_or_default()
        } else {
            String::new()
        };

        let time_details = schedule
            .time_details
            .clone()
            .unwrap_or_default()
            .iter()
            .map(|td| {
                let td: Result<TimeDetails, _> =
                    serde_json::from_value(td.clone().unwrap_or_default());
                if td.is_ok() {
                    Some(td.unwrap_or_default())
                } else {
                    Some(TimeDetails::default())
                }
            })
            .collect();

        Some(Self {
            every: schedule.every.unwrap_or_default(),
            is_active: schedule.is_active.unwrap_or_default(),
            recipients: schedule.recipients.clone().unwrap_or_default(),
            time_details,
            time_unit: schedule.time_unit.clone().unwrap_or_default(),
            timezone: schedule.timezone.clone().unwrap_or_default(),
            subject: schedule.subject.clone().unwrap_or_default(),
            email_content,
        })
    }
}
