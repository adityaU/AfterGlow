use serde::{Deserialize, Serialize};

use crate::repository::models::SystemVariable;
#[derive(Debug, Deserialize, Serialize)]
pub struct SystemVariableView {
    pub id: i64,
    pub name: String,
    value: String,
}

impl SystemVariableView {
    pub fn from_model(sv: &SystemVariable) -> Self {
        let value = match String::from_utf8(sv.clone().value) {
            Ok(string) => string,
            Err(_e) => "Invalid Value".to_string(),
        };
        Self {
            id: sv.id,
            name: sv.name.clone(),
            value,
        }
    }
}
