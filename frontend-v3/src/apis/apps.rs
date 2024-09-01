use std::error::Error;

use common::{
    models::{
        app::AppView,
        app_column::{AppColumnView, TypeValidation},
        app_table::AppTableView,
        row::RowElement,
    },
    responses::row_response::SingleRowResponse,
};
use serde_json::json;

use super::{ApiClient, ApiResponse};

// #[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
// #[serde(untagged)]
// pub enum AppsResponse {
//     Success { data: Vec<AppView> },
//     Error { error: String },
// }
//
// #[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
// #[serde(untagged)]
// pub enum AppResponse {
//     Success { data: AppView },
//     Error { error: String },
// }
//
// impl Default for AppsResponse {
//     fn default() -> Self {
//         AppsResponse::Success { data: vec![] }
//     }
// }
//
// #[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
// #[serde(untagged)]
// pub enum CreateResponse {
//     Success { data: AppView },
//     Error { error: String },
// }
//
// impl Default for CreateResponse {
//     fn default() -> Self {
//         CreateResponse::Success {
//             data: AppView::default(),
//         }
//     }
// }
//
// #[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
// #[serde(untagged)]
// pub enum TablesResponse {
//     Success { data: Vec<AppTableView> },
//     Error { error: String },
// }
//
// #[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
// #[serde(untagged)]
// pub enum CreateTableResponse {
//     Success { data: AppTableView },
//     Error { error: String },
// }
//
// #[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
// #[serde(untagged)]
// pub enum ColumnsResponse {
//     Success { data: Vec<AppColumnView> },
//     Error { error: String },
// }
//
// #[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
// #[serde(untagged)]
// pub enum CreateColumnResponse {
//     Success { data: AppColumnView },
//     Error { error: String },
// }
//
pub async fn fetch_all() -> Result<Vec<AppView>, Box<dyn Error>> {
    ApiClient::new().get::<Vec<AppView>>("/apps").await
}

pub async fn fetch(id: i32) -> Result<AppView, Box<dyn Error>> {
    ApiClient::new()
        .get::<AppView>(format!("/apps/{}", id).as_str())
        .await
}

pub async fn create(name: String, desc: String) -> Result<AppView, Box<dyn Error>> {
    ApiClient::new()
        .post::<AppView>(
            "/apps",
            json!({
                "name": name,
                "description": desc
            }),
        )
        .await
    // Convert the response data to a Session struct
}

pub async fn fetch_tables(app_id: i32) -> Result<Vec<AppTableView>, Box<dyn Error>> {
    ApiClient::new()
        .get::<Vec<AppTableView>>(format!("/apps/{}/tables", app_id).as_str())
        .await
}

pub async fn create_table(
    name: String,
    desc: String,
    app_id: i32,
) -> Result<AppTableView, Box<dyn Error>> {
    ApiClient::new()
        .post::<AppTableView>(
            "/app_tables",
            json!({
                "name": name,
                "description": desc,
                "app_id": app_id
            }),
        )
        .await
}

pub async fn fetch_columns(table_id: i64) -> Result<Vec<AppColumnView>, Box<dyn Error>> {
    ApiClient::new()
        .get::<Vec<AppColumnView>>(format!("/app_tables/{}/columns", table_id).as_str())
        .await
}

pub async fn create_column(
    name: String,
    desc: String,
    table_id: i64,
    type_validation: TypeValidation,
    display_order: i32,
) -> Result<AppColumnView, Box<dyn Error>> {
    ApiClient::new()
        .post::<AppColumnView>(
            "/app_columns",
            json!({
                "name": name,
                "description": desc,
                "table_id": table_id,
                "is_primary": false,
                "type_validation": type_validation,
                "display_order": display_order
            }),
        )
        .await
}

pub async fn create_empty_row(table_id: i64) -> Result<SingleRowResponse, Box<dyn Error>> {
    ApiClient::new()
        .post::<SingleRowResponse>(
            format!("/app_tables/{}/create_new_row", table_id).as_str(),
            json!({
            "primary_key_value": null,
            }),
        )
        .await
}
