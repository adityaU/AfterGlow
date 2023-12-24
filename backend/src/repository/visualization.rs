use super::models::Visualization;
use super::schema::{questions, visualizations};

use diesel::dsl::sql;
use diesel::prelude::Queryable;
use diesel::result::Error;
use serde::{Deserialize, Serialize};

use crate::diesel::JoinOnDsl;

use crate::diesel::PgTextExpressionMethods;

use crate::diesel::BoolExpressionMethods;

use diesel::sql_types::{BigInt, Bool, Nullable};
use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};

#[derive(Queryable, Debug, Clone, Serialize, Deserialize)]
pub struct QuestionVisulization {
    pub question_id: Option<i64>,
    pub visualization_id: i64,
    pub question_title: Option<String>,
    pub visualization_name: Option<String>,
}

impl visualizations::table {
    fn shared_with_user<'a>(user_email: String, permissions: Vec<String>) -> String {
        if permissions.contains(&"Settings.all".to_string()) {
            return "visualizations.id in (select id from visualizations)".into();
        }
        let q = format!("visualizations.id = ANY(select id from visualizations where question_id in (SELECT s.id
            FROM questions s
            LEFT JOIN dashboard_widgets dwq ON dwq.widget_id = s.id AND dwq.widget_type = 'question'
            LEFT JOIN dashboards ddwq ON dwq.dashboard_id = ddwq.id
            LEFT JOIN visualizations v ON s.id = v.question_id
            LEFT JOIN dashboard_widgets dwv ON dwv.widget_id = v.id AND dwv.widget_type = 'visualization'
            LEFT JOIN dashboards ddwv ON dwv.dashboard_id = ddwv.id
            LEFT JOIN dashboard_widgets dwvd ON (dwvd.widget_id = ddwv.id OR dwvd.widget_id = ddwq.id) AND dwvd.widget_type = 'tabs'
            LEFT JOIN dashboards ddd ON dwvd.dashboard_id = ddd.id
            LEFT JOIN users on users.id = s.owner_id
            WHERE users.email = '{}'
            OR '{}' = ANY (s.shared_to) 
            OR 'all' = ANY (s.shared_to) 
            OR '{}' = ANY (ddwq.shared_to) 
            OR 'all' = ANY (ddwq.shared_to) 
            OR '{}' = ANY (ddwv.shared_to) 
            OR 'all' = ANY (ddwv.shared_to) 
            OR '{}' = ANY (ddd.shared_to) 
            OR 'all' = ANY (ddd.shared_to)
            GROUP BY s.id))", user_email, user_email, user_email, user_email, user_email);
        println!("{}", q);
        q
    }
}

impl Visualization {
    pub fn find_scoped(
        conn: &mut PgConnection,
        id: i64,
        user_email: String,
        permissions: Vec<String>,
    ) -> Result<Self, Error> {
        visualizations::table
            .filter(sql::<Bool>(
                visualizations::table::shared_with_user(user_email, permissions).as_str(),
            ))
            .filter(visualizations::id.eq(id))
            .first::<Self>(conn)
    }
    pub fn find_by_question_id(conn: &mut PgConnection, qid: i32) -> Result<Vec<Self>, Error> {
        visualizations::table
            .filter(visualizations::question_id.eq(qid as i64))
            .load::<Self>(conn)
    }

    pub fn search(
        conn: &mut PgConnection,
        q: String,
        user_email: String,
        permissions: Vec<String>,
    ) -> Result<Vec<QuestionVisulization>, Error> {
        visualizations::table
            .filter(sql::<Bool>(
                visualizations::table::shared_with_user(user_email, permissions).as_str(),
            ))
            .inner_join(
                questions::table
                    .on(visualizations::question_id.eq(sql::<Nullable<BigInt>>("questions.id"))),
            )
            .filter(
                visualizations::name
                    .ilike(format!("%{}%", q))
                    .or(questions::title.ilike(format!("%{}%", q))),
            )
            .select((
                visualizations::question_id,
                visualizations::id,
                questions::title,
                visualizations::name,
            ))
            .order(visualizations::updated_at.desc())
            .limit(10)
            .load::<QuestionVisulization>(conn)
    }
}
