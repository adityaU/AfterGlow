use chrono::NaiveDateTime;
use diesel::PgConnection;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::repository::models::{Dashboard, VariableView};

#[derive(Debug, Serialize, Deserialize)]
pub struct DetailedDashboardView {
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
    pub possible_variables: Vec<VariableView>, // pub notes: Vec<NoteView>,
                                               // pub owner: Option<RestrictedUserView>,
                                               // pub tags: Vec<TagView>,
                                               // pub variables: Vec<VariableView>,
}

impl DetailedDashboardView {
    pub fn from_model(conn: &mut PgConnection, dashboard: &Dashboard) -> Self {
        // let notes = Note::find_by_dashboard_id(conn, dashboard.id)
        //     .unwrap_or(vec![])
        //     .iter()
        //     .map(|note| NoteView::from_model(note))
        //     .collect();
        // let variables = Variable::find_by_dashboard_id(conn, dashboard.id)
        //     .unwrap_or(vec![])
        //     .iter()
        //     .map(|variable| VariableView::from_model(variable))
        //     .collect();
        // let tags = Tag::find_by_dashboard_id(conn, dashboard.id)
        //     .unwrap_or(vec![])
        //     .iter()
        //     .map(|tag| TagView::from_model(tag))
        //     .collect();
        // let owner = match dashboard.owner_id {
        //     Some(owner_id) => match User::find(conn, owner_id) {
        //         Ok(user) => Some(RestrictedUserView::from_model(&user)),
        //         Err(_) => None,
        //     },
        //     None => None,
        // };
        //
        let possible_variables = Dashboard::fetch_possible_variables(conn, dashboard.id)
            .ok()
            .unwrap_or(vec![])
            .iter()
            .map(|var| VariableView::from_model(var))
            .collect::<Vec<VariableView>>();

        Self {
            id: dashboard.id,
            title: dashboard.title.clone(),
            update_interval: dashboard.update_interval,
            last_updated: dashboard.last_updated,
            inserted_at: dashboard.inserted_at,
            updated_at: dashboard.updated_at,
            description: dashboard.description.clone(),
            shareable_link: dashboard.shareable_link,
            is_shareable_link_public: dashboard.is_shareable_link_public,
            settings: dashboard.settings.clone(),
            shared_to: dashboard.shared_to.clone(),
            owner_id: dashboard.owner_id,
            possible_variables,
            // notes: notes,
            // owner: owner,
            // tags: tags,
            // variables: variables,
        }
    }
}
