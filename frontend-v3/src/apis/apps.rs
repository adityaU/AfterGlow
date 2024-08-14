use std::error::Error;

use common::models::{
    app::AppView,
    app_column::{AppColumnView, TypeValidation},
    app_table::AppTableView,
};
use serde_json::json;
use web_sys::{console, wasm_bindgen::JsValue};

use super::ApiClient;

#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(untagged)]
pub enum AppsResponse {
    Success { data: Vec<AppView> },
    Error { error: String },
}

#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(untagged)]
pub enum AppResponse {
    Success { data: AppView },
    Error { error: String },
}

impl Default for AppsResponse {
    fn default() -> Self {
        AppsResponse::Success { data: vec![] }
    }
}

#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(untagged)]
pub enum CreateResponse {
    Success { data: AppView },
    Error { error: String },
}

impl Default for CreateResponse {
    fn default() -> Self {
        CreateResponse::Success {
            data: AppView::default(),
        }
    }
}

#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(untagged)]
pub enum TablesResponse {
    Success { data: Vec<AppTableView> },
    Error { error: String },
}

#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(untagged)]
pub enum CreateTableResponse {
    Success { data: AppTableView },
    Error { error: String },
}

#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(untagged)]
pub enum ColumnsResponse {
    Success { data: Vec<AppColumnView> },
    Error { error: String },
}

#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(untagged)]
pub enum CreateColumnResponse {
    Success { data: AppColumnView },
    Error { error: String },
}

pub async fn fetch_all() -> Result<Vec<AppView>, Box<dyn Error>> {
    let response = ApiClient::new().get("/apps").await;
    match response {
        Ok(resp) => {
            let apps_response: AppsResponse =
                serde_json::from_value(resp.message).map_err(|e| {
                    console::log_1(&JsValue::from_str(&format!("Error: {:?}", e).as_str()));
                    e.to_string()
                })?;
            match apps_response {
                AppsResponse::Success { data } => {
                    console::log_1(&JsValue::from_str(&format!("Apps: {:?}", data).as_str()));

                    Ok(data)
                }
                AppsResponse::Error { error } => Err(error.into()),
            }
        }
        Err(e) => Err(e),
    }
    // Convert the response data to a Session struct
}

pub async fn fetch(id: i32) -> Result<AppView, Box<dyn Error>> {
    let response = ApiClient::new().get(format!("/apps/{}", id).as_str()).await;
    match response {
        Ok(resp) => {
            let app_response: AppResponse =
                serde_json::from_value(resp.message).map_err(|e| e.to_string())?;
            match app_response {
                AppResponse::Success { data } => Ok(data),
                AppResponse::Error { error } => Err(error.into()),
            }
        }
        Err(e) => Err(e),
    }
    // Convert the response data to a Session struct
}

pub async fn create(name: String, desc: String) -> Result<AppView, Box<dyn Error>> {
    let response = ApiClient::new()
        .post(
            "/apps",
            json!({
                "name": name,
                "description": desc
            }),
        )
        .await;
    match response {
        Ok(resp) => {
            let create_response: CreateResponse =
                serde_json::from_value(resp.message).map_err(|e| e.to_string())?;
            match create_response {
                CreateResponse::Success { data } => Ok(data),
                CreateResponse::Error { error } => Err(error.into()),
            }
        }
        Err(e) => Err(e),
    }
    // Convert the response data to a Session struct
}

pub async fn fetch_tables(app_id: i32) -> Result<Vec<AppTableView>, Box<dyn Error>> {
    let response = ApiClient::new()
        .get(format!("/apps/{}/tables", app_id).as_str())
        .await;
    match response {
        Ok(resp) => {
            let tables_response: TablesResponse =
                serde_json::from_value(resp.message).map_err(|e| e.to_string())?;
            match tables_response {
                TablesResponse::Success { data } => Ok(data),
                TablesResponse::Error { error } => Err(error.into()),
            }
        }
        Err(e) => Err(e),
    }
}

pub async fn create_table(
    name: String,
    desc: String,
    app_id: i32,
) -> Result<AppTableView, Box<dyn Error>> {
    let response = ApiClient::new()
        .post(
            "/app_tables",
            json!({
                "name": name,
                "description": desc,
                "app_id": app_id
            }),
        )
        .await;
    match response {
        Ok(resp) => {
            let table_response: CreateTableResponse =
                serde_json::from_value(resp.message).map_err(|e| e.to_string())?;
            match table_response {
                CreateTableResponse::Success { data } => Ok(data),
                CreateTableResponse::Error { error } => Err(error.into()),
            }
        }
        Err(e) => Err(e),
    }
}

pub async fn fetch_columns(table_id: i64) -> Result<Vec<AppColumnView>, Box<dyn Error>> {
    let response = ApiClient::new()
        .get(format!("/app_tables/{}/columns", table_id).as_str())
        .await;
    match response {
        Ok(resp) => {
            let columns_response: ColumnsResponse =
                serde_json::from_value(resp.message).map_err(|e| e.to_string())?;
            match columns_response {
                ColumnsResponse::Success { data } => Ok(data),
                ColumnsResponse::Error { error } => Err(error.into()),
            }
        }
        Err(e) => Err(e),
    }
}

pub async fn create_column(
    name: String,
    desc: String,
    table_id: i64,
    type_validation: TypeValidation,
    display_order: i32,
) -> Result<AppColumnView, Box<dyn Error>> {
    let response = ApiClient::new()
        .post(
            "/app_columns",
            json!({
                "name": name,
                "description": desc,
                "table_id": table_id,
                "type_validation": type_validation,
                "display_order": display_order
            }),
        )
        .await;
    match response {
        Ok(resp) => {
            let column_response: CreateColumnResponse =
                serde_json::from_value(resp.message).map_err(|e| e.to_string())?;
            match column_response {
                CreateColumnResponse::Success { data } => Ok(data),
                CreateColumnResponse::Error { error } => Err(error.into()),
            }
        }
        Err(e) => Err(e),
    }
}
