use chrono::NaiveDateTime;

use serde::{Deserialize, Serialize};

use crate::repository::models::User;

#[derive(Debug, Serialize, Deserialize, Clone)]

pub struct RestrictedUserView {
    pub id: i64,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<String>,
    pub full_name: Option<String>,
    pub profile_pic: Option<String>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub is_deactivated: Option<bool>,
}

impl RestrictedUserView {
    pub fn from_model(user: &User) -> Self {
        Self {
            id: user.id,
            first_name: user.first_name.clone(),
            last_name: user.last_name.clone(),
            email: user.email.clone(),
            full_name: user.full_name.clone(),
            profile_pic: user.profile_pic.clone(),
            inserted_at: user.inserted_at,
            updated_at: user.updated_at,
            is_deactivated: user.is_deactivated,
        }
    }
}
