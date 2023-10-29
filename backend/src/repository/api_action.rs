use diesel::PgConnection;

use super::models::{ActionLevel, ApiAction};
use super::schema::api_actions;

use diesel::prelude::*;
use diesel::result::Error;

impl ApiAction {
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
