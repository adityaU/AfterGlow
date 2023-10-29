
use super::schema::{questions, tag_dashboards, tag_questions};
use super::{models::Tag, schema::tags};

use crud_derive::View;

use diesel::dsl::sql;
use diesel::pg::Pg;
use diesel::prelude::*;
use diesel::result::Error;

use diesel::sql_types::{Nullable, Text};
use serde::{Deserialize, Serialize};

use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};

#[derive(Queryable, Debug, Clone, View, Serialize, Deserialize)]
#[view_name = "StrippedQuestionTagView"]
pub struct QuestionTag {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    pub color: Option<String>,
    pub question_id: Option<i32>,
}

#[derive(Debug)]
struct QuestionTags {
    question: questions::table,
    tag_questions: tag_questions::table,
    tags: tags::table,
}

impl tags::table {
    pub fn shared_with_user<'a>(
        conn: &mut PgConnection,
        user_email: String,
        permissions: Vec<String>,
    ) -> Result<tags::BoxedQuery<'a, Pg>, Error> {
        let base_query = tags::table.into_boxed();

        if permissions.contains(&"Settings.all".to_string()) {
            return Ok(base_query);
        }

        let tag_ids = tags::table
            .inner_join(tag_questions::table.on(tag_questions::tag_id.eq(tags::id.nullable())))
            .inner_join(
                questions::table.on(tag_questions::question_id.eq(questions::id.nullable())),
            )
            .filter(
                sql::<diesel::sql_types::Bool>("")
                    .bind::<Nullable<Text>, _>(user_email)
                    .sql(" = ANY(shared_to)"),
            )
            .select(tags::id)
            .group_by(tags::id)
            .load::<i32>(conn)?;

        Ok(base_query.filter(tags::id.eq_any(tag_ids)))
    }
}

impl Tag {
    pub fn scoped_index(
        conn: &mut PgConnection,
        user_email: String,
        permissions: Vec<String>,
    ) -> Result<Vec<Self>, Error> {
        let query = tags::table::shared_with_user(conn, user_email, permissions)?;
        query.select(tags::all_columns).load::<Self>(conn)
    }
    pub fn find_by_question_ids(
        conn: &mut PgConnection,
        qids: Vec<i32>,
    ) -> Result<Vec<QuestionTag>, Error> {
        tags::table
            .inner_join(tag_questions::table.on(tags::id.nullable().eq(tag_questions::question_id)))
            .filter(tag_questions::question_id.eq_any(qids))
            .select((
                tags::id,
                tags::name,
                tags::description,
                tags::color,
                tag_questions::question_id,
            ))
            .load::<QuestionTag>(conn)
    }
    pub fn find_by_dashboard_id(conn: &mut PgConnection, did: i32) -> Result<Vec<Self>, Error> {
        tags::table
            .inner_join(
                tag_dashboards::table.on(tags::id.nullable().eq(tag_dashboards::dashboard_id)),
            )
            .filter(tag_dashboards::dashboard_id.eq(did))
            .select(tags::all_columns)
            .load::<Self>(conn)
    }
}
