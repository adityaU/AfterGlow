use diesel::PgConnection;

use super::models::{ActionLevel, ApiAction, ApiActionChangeset};
use super::schema::api_actions;

use diesel::prelude::*;
use diesel::result::Error;

impl ApiAction {
    pub fn to_changeset(&self) -> ApiActionChangeset {
        ApiActionChangeset {
            question_id: self.question_id,
            url: self.url.clone(),
            headers: self.headers.clone(),
            body: self.body.clone(),
            method: self.method.clone(),
            name: self.name.clone(),
            color: self.color.clone(),
            open_in_new_tab: self.open_in_new_tab.clone(),
            response_settings: self.response_settings.clone(),
            hidden: self.hidden,
            inserted_at: self.inserted_at,
            updated_at: self.updated_at,
            column: self.column.clone(),
            on_success: self.on_success,
            on_failure: self.on_failure,
            failure_message: self.failure_message.clone(),
            failure_key: self.failure_key.clone(),
            success_message: self.success_message.clone(),
            success_key: self.success_key.clone(),
            action_level: self.action_level.clone(),
            visualization_id: self.visualization_id,
            loading_message: self.loading_message.clone(),
            display_settings: self.display_settings.clone(),
            open_option: self.open_option.clone(),
        }
    }
    pub fn find_direct_actions_by_question_id(
        conn: &mut PgConnection,
        qid: i32,
    ) -> Result<Self, Error> {
        api_actions::table
            .filter(api_actions::question_id.eq(qid))
            .filter(api_actions::action_level.eq(ActionLevel::Question))
            .first::<Self>(conn)
    }
    pub fn find_by_question_id(conn: &mut PgConnection, qid: i32) -> Result<Vec<Self>, Error> {
        api_actions::table
            .filter(api_actions::question_id.eq(qid))
            .filter(api_actions::action_level.eq(ActionLevel::QuestionResponse))
            .load::<Self>(conn)
    }
}
