use std::collections::HashMap;

use chrono::NaiveDateTime;
use diesel::PgConnection;


use serde::{Deserialize, Serialize};

use crate::repository::{
    models::{ApiAction, ApiActionView, QueryType, Question, Tag, User},
    tag::StrippedQuestionTagView,
};

use super::user::RestrictedUserView;

use diesel::result::Error;

use uuid::Uuid;

#[derive(Deserialize, Serialize)]
pub struct QuestionIndexView {
    id: i32,
    title: String,
    inserted_at: NaiveDateTime,
    database_name: String,
    database_type: String,
    updated_at: NaiveDateTime,
    tags: Vec<StrippedQuestionTagView>,
    owner: Option<RestrictedUserView>,
}

impl QuestionIndexView {
    pub fn from_models(conn: &mut PgConnection, items: &Vec<Question>) -> Result<Vec<Self>, Error> {
        let question_ids = items.iter().map(|item| item.id).collect();
        let tags = Tag::find_by_question_ids(conn, question_ids)?;
        let owner_ids = items
            .iter()
            .map(|item| item.owner_id.unwrap_or(0))
            .collect();
        let users = User::find_by_ids(conn, owner_ids)?;
        let mut owner_user_map: HashMap<i32, RestrictedUserView> = HashMap::new();
        let mut question_tag_map: HashMap<i32, Vec<StrippedQuestionTagView>> = HashMap::new();

        for tag in tags {
            question_tag_map
                .entry(tag.question_id.unwrap_or(0))
                .or_insert_with(Vec::new)
                .push(StrippedQuestionTagView::from_model(&tag))
        }

        for user in users {
            owner_user_map.insert(user.id, RestrictedUserView::from_model(&user));
        }

        let mut result = Vec::new();

        let empty_tag_vec: Vec<StrippedQuestionTagView> = Vec::new();

        for question in items {
            let owner = owner_user_map.get(&question.owner_id.unwrap_or_default());
            let owner_value: Option<RestrictedUserView> = owner.map(|o| o.clone());
            let db_name = &question.extract_from_db_config("name");
            let db_type = &question.extract_from_db_config("db_type");

            result.push(Self {
                id: question.id,
                title: question.title.clone().unwrap_or("".to_string()),
                inserted_at: question.inserted_at,
                database_name: db_name.clone(),
                database_type: db_type.clone(),
                updated_at: question.updated_at,
                tags: question_tag_map
                    .get(&question.id)
                    .unwrap_or(&empty_tag_vec)
                    .clone(),
                owner: owner_value,
            });
        }

        Ok(result)
    }
}

#[derive(Deserialize, Serialize)]
pub struct QuestionShowView {
    pub id: i32,
    pub title: Option<String>,
    pub last_updated: Option<NaiveDateTime>,
    pub sql: Option<String>,
    pub human_sql: Option<serde_json::Value>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
    pub query_type: Option<QueryType>,
    pub shareable_link: Option<Uuid>,
    pub is_shareable_link_public: Option<bool>,
    pub shared_to: Option<Vec<Option<String>>>,
    pub owner_id: Option<i32>,
    pub config: Option<serde_json::Value>,
    pub api_action: Option<ApiActionView>,
}

impl QuestionShowView {
    pub fn from_model(conn: &mut PgConnection, question: &Question) -> Self {
        let api_action = match ApiAction::find_direct_actions_by_question_id(conn, question.id).ok()
        {
            Some(aa) => Some(ApiActionView::from_model(&aa)),
            None => None,
        };
        Self {
            id: question.id,
            title: question.title.clone(),
            last_updated: question.last_updated,
            sql: question.sql.clone(),
            human_sql: question.human_sql.clone(),
            inserted_at: question.inserted_at,
            updated_at: question.updated_at,
            query_type: question.query_type.clone(),
            shareable_link: question.shareable_link,
            is_shareable_link_public: question.is_shareable_link_public,
            shared_to: question.shared_to.clone(),
            owner_id: question.owner_id,
            config: question.config.clone(),
            api_action: api_action,
        }
    }
}
