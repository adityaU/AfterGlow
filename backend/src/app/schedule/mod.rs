use serde::{Deserialize, Serialize};

use crate::repository::models::TimeUnit;

#[derive(Deserialize, Serialize, Clone)]
#[serde(untagged)]
pub enum TimeDetails {
    Week {
        day: Days,
        hour: u8,
        minute: u8,
        am: Meridiem,
    },
    Month {
        date: u8,
        hour: u8,
        minute: u8,
        am: Meridiem,
    },
    Day {
        hour: u8,
        minute: u8,
        am: Meridiem,
    },
    Hour {
        minute: u8,
    },
}

impl Default for TimeDetails {
    fn default() -> Self {
        TimeDetails::Hour { minute: 0 }
    }
}

#[derive(Deserialize, Serialize, Clone, Default)]
pub enum Meridiem {
    #[default]
    AM,
    PM,
}

#[derive(Deserialize, Serialize, Hash, PartialEq, Eq, Clone, Default)]
pub enum Days {
    #[default]
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
#[serde(untagged)]
pub enum JobDetails {
    Dashboard(DashboardJobDetail),
    Visualization(VisualizationJobDetail),
}

#[derive(Debug, Deserialize, Serialize, Clone)]
#[serde(rename_all = "snake_case")]
pub enum JobTypes {
    DashboardMailer,
    VisualizationMailer,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct DashboardJobDetail {
    pub dashboard_id: i64,
    #[serde(rename = "type")]
    pub type_: JobTypes,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct VisualizationJobDetail {
    pub visualization_id: i64,
    #[serde(rename = "type")]
    pub type_: JobTypes,
    pub email_content: Option<String>,
}

#[derive(Deserialize, Serialize)]
pub struct SchedulePayload {
    pub every: i32,
    pub is_active: bool,
    pub recipients: Vec<Option<String>>,
    pub time_details: Vec<Option<TimeDetails>>,
    pub time_unit: TimeUnit,
    pub timezone: chrono_tz::Tz,
    pub subject: String,
    pub email_content: Option<String>,
}
