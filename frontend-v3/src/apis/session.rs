use std::error::Error;

use super::ApiClient;

use serde_derive::Deserialize;
use serde_derive::Serialize;
use web_sys::console;
use web_sys::wasm_bindgen::JsValue;

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Session {
    pub token: String,
    pub user: User,
    pub permissions: Vec<String>,
    pub databases: Vec<String>,
    pub theme: Theme,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct User {
    pub id: i64,
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub full_name: String,
    pub profile_pic: String,
    pub inserted_at: String,
    pub updated_at: String,
    pub is_deactivated: bool,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Theme {
    pub primary_color: String,
    pub secondary_color: String,
    pub tertiary_color: String,
    pub white_color: String,
    pub default_color: String,
}

pub async fn verify_token(token: String) -> Result<Session, Box<dyn Error>> {
    let body = serde_json::json!({
        "token": token,
    });

    console::log_1(&JsValue::from_str(&format!("Session: loading")));
    let response = ApiClient::new().post("/verify_token/", body).await;
    match response {
        Ok(resp) => {
            let session = serde_json::from_value(resp.message)?;
            console::log_1(&JsValue::from_str(&format!("Session: {:?}", session)));
            Ok(session)
        }
        Err(e) => {
            console::log_1(&JsValue::from_str(&format!("Error session: {:?}", e)));
            Err(e)
        }
    }
    // Convert the response data to a Session struct
}
