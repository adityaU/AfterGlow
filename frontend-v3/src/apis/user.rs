use std::error::Error;


use super::ApiClient;

#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(untagged)]
pub enum UsersResponse {
    Success { data: Vec<User> },
    Error { error: String },
}
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct User {
    pub id: i64,
    pub email: String,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
}

pub async fn search(q: String) -> Result<Vec<User>, Box<dyn Error>> {
    let response = ApiClient::new()
        .get(format!("/users/search?query={}", q).as_str())
        .await;
    match response {
        Ok(resp) => {
            let app_response: UsersResponse =
                serde_json::from_value(resp.message).map_err(|e| e.to_string())?;
            match app_response {
                UsersResponse::Success { data } => Ok(data),
                UsersResponse::Error { error } => Err(error.into()),
            }
        }
        Err(e) => Err(e),
    }
    // Convert the response data to a Session struct
}

pub async fn find_by_ids(ids: Vec<i64>) -> Result<Vec<User>, Box<dyn Error>> {
    let query_params: String = ids
        .iter()
        .map(|id| id.to_string())
        .collect::<Vec<String>>()
        .join(",");
    let response = ApiClient::new()
        .get(format!("/users/search?ids={}", query_params).as_str())
        .await;
    match response {
        Ok(resp) => {
            let app_response: UsersResponse =
                serde_json::from_value(resp.message).map_err(|e| e.to_string())?;
            match app_response {
                UsersResponse::Success { data } => Ok(data),
                UsersResponse::Error { error } => Err(error.into()),
            }
        }
        Err(e) => Err(e),
    }
    // Convert the response data to a Session struct
}
