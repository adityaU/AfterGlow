use super::models::{TagChangeset, TagQuestion, TagQuestionChangeset};
use super::schema::{questions, tag_dashboards, tag_questions};
use super::{models::Tag, schema::tags};

use chrono::Utc;
use crud_derive::View;

use diesel::dsl::sql;
use diesel::pg::Pg;
use diesel::result::Error;
use diesel::{debug_query, prelude::*};

use diesel::sql_types::{Nullable, Text};
use serde::{Deserialize, Serialize};

use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};

#[derive(Queryable, Debug, Clone, View, Serialize, Deserialize)]
#[view_name = "StrippedQuestionTagView"]
pub struct QuestionTag {
    pub id: i64,
    pub name: String,
    pub description: Option<String>,
    pub color: Option<String>,
    pub question_id: Option<i64>,
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
            .load::<i64>(conn)?;

        Ok(base_query.filter(tags::id.eq_any(tag_ids)))
    }
}

impl Tag {
    pub fn search(conn: &mut PgConnection, q: String) -> Result<Vec<Self>, Error> {
        tags::table
            .filter(tags::name.ilike(format!("%{}%", q)))
            .load::<Self>(conn)
    }
    pub fn scoped_index(
        conn: &mut PgConnection,
        user_email: String,
        permissions: Vec<String>,
    ) -> Result<Vec<Self>, Error> {
        let query = tags::table::shared_with_user(conn, user_email, permissions)?;
        query.select(tags::all_columns).load::<Self>(conn)
    }

    pub fn find_by_question_id(
        conn: &mut PgConnection,
        qid: i64,
    ) -> Result<Vec<QuestionTag>, Error> {
        let query = tags::table
            .inner_join(tag_questions::table.on(tags::id.nullable().eq(tag_questions::tag_id)))
            .filter(tag_questions::question_id.eq(qid))
            .select((
                tags::id,
                tags::name,
                tags::description,
                tags::color,
                tag_questions::question_id,
            ));
        query.load::<QuestionTag>(conn)
    }
    pub fn find_by_question_ids(
        conn: &mut PgConnection,
        qids: Vec<i64>,
    ) -> Result<Vec<QuestionTag>, Error> {
        let query = tags::table
            .inner_join(tag_questions::table.on(tags::id.nullable().eq(tag_questions::tag_id)))
            .filter(tag_questions::question_id.eq_any(qids))
            .select((
                tags::id,
                tags::name,
                tags::description,
                tags::color,
                tag_questions::question_id,
            ));
        query.load::<QuestionTag>(conn)
    }
    pub fn find_by_dashboard_id(conn: &mut PgConnection, did: i64) -> Result<Vec<Self>, Error> {
        tags::table
            .inner_join(
                tag_dashboards::table.on(tags::id.nullable().eq(tag_dashboards::dashboard_id)),
            )
            .filter(tag_dashboards::dashboard_id.eq(did))
            .select(tags::all_columns)
            .load::<Self>(conn)
    }
    pub fn create_question_tag(
        conn: &mut PgConnection,
        tag_changeset: TagChangeset,
        question_id: i64,
    ) -> Result<(), Error> {
        Ok(conn.transaction::<_, Error, _>(|conn| {
            let tag = Self::create(conn, tag_changeset)?;
            TagQuestion::create_or_update(
                conn,
                &TagQuestionChangeset {
                    question_id: Some(question_id),
                    tag_id: Some(tag.id),
                    inserted_at: Utc::now().naive_utc(),
                    updated_at: Utc::now().naive_utc(),
                },
            )?;
            Ok(())
        })?)
    }
}

impl TagQuestion {
    pub fn create_or_update(
        conn: &mut PgConnection,
        tq: &TagQuestionChangeset,
    ) -> Result<(), Error> {
        Ok(conn.transaction::<_, Error, _>(|conn| {
            if let Ok(_tag_question) = tag_questions::table
                .filter(tag_questions::tag_id.eq(&tq.tag_id))
                .filter(tag_questions::question_id.eq(&tq.question_id))
                .first::<TagQuestion>(conn)
            {
                return Ok(());
            }
            TagQuestion::create(conn, tq.clone());
            Ok(())
        })?)
    }

    pub fn delete_by_tag_ids_and_question_id(
        conn: &mut PgConnection,
        tag_ids: Vec<i64>,
        question_id: i64,
    ) -> Result<(), Error> {
        diesel::delete(tag_questions::table)
            .filter(tag_questions::tag_id.eq_any(tag_ids))
            .filter(tag_questions::question_id.eq(question_id))
            .execute(conn)?;
        Ok(())
    }
}
