use std::error::Error;

use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::ApiClient;

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DashboardsResponse {
    pub data: Vec<Dashboard>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Dashboard {
    pub id: i64,
    pub title: Option<String>,
    pub update_interval: Option<i32>,
    pub last_updated: Option<NaiveDateTime>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub description: Option<String>,
    pub shareable_link: Option<Uuid>,
    pub is_shareable_link_public: Option<bool>,
    pub settings: Option<serde_json::Value>,
    pub shared_to: Option<Vec<Option<String>>>,
    pub owner_id: Option<i64>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Settings {
    pub version: i64,
    pub widgets: Vec<Widget>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Widget {
    pub h: i64,
    #[serde(rename = "type")]
    pub type_field: String,
    pub w: i64,
    #[serde(rename = "widID")]
    pub wid_id: i64,
    pub x: i64,
    pub y: i64,
    pub formatting_settings: Option<FormattingSettings>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FormattingSettings {
    pub background_color: String,
    pub border_color: String,
    pub border_position: Vec<String>,
    pub border_radius: i64,
    pub border_thickness: i64,
    pub gap_around: f64,
    pub header_background_color: String,
    pub header_text_color: String,
    pub shadow: String,
    pub show_header: bool,
}

pub async fn fetch_all() -> Vec<Dashboard> {
    ApiClient::new()
        .get::<Vec<Dashboard>>("/dashboards?limit=5")
        .await
        .unwrap_or_default()
}
