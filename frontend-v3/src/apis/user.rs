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
    ApiClient::new()
        .get::<Vec<User>>(format!("/users/search?query={}", q).as_str())
        .await
}

pub async fn find_by_ids(ids: Vec<i64>) -> Result<Vec<User>, Box<dyn Error>> {
    let query_params: String = ids
        .iter()
        .map(|id| id.to_string())
        .collect::<Vec<String>>()
        .join(",");
    ApiClient::new()
        .get::<Vec<User>>(format!("/users/search?ids={}", query_params).as_str())
        .await
    // Convert the response data to a Session struct
}
