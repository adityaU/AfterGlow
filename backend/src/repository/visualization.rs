use super::models::Visualization;
use super::permissions::PermissionNames;
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
    fn shared_with_user<'a>(user_email: String, permissions: Vec<PermissionNames>) -> String {
        if permissions.contains(&PermissionNames::SettingsAll) {
            return "visualizations.id in (select id from visualizations)".into();
        }
        format!("visualizations.id = ANY(select id from visualizations where question_id in (SELECT s.id
            FROM questions s
            LEFT JOIN dashboard_widgets dwq ON dwq.widget_id = s.id AND dwq.widget_type = 'question'
            LEFT JOIN dashboards ddwq ON dwq.dashboard_id = ddwq.id
            LEFT JOIN visualizations v ON s.id = v.question_id
            LEFT JOIN dashboard_widgets dwv ON dwv.widget_id = v.id AND dwv.widget_type = 'visualization'
            LEFT JOIN dashboards ddwv ON dwv.dashboard_id = ddwv.id
            LEFT JOIN dashboard_widgets dwvd ON (dwvd.widget_id = ddwv.id OR dwvd.widget_id = ddwq.id) AND dwvd.widget_type = 'tabs'
            LEFT JOIN dashboards ddd ON dwvd.dashboard_id = ddd.id
            LEFT JOIN users on users.id = s.owner_id
            LEFT JOIN team_shares ts ON ts.shared_id = s.id AND ts.shared_entity = 1
            LEFT JOIN teams t ON t.id = ts.team_id
            LEFT JOIN user_teams ut ON ut.team_id = t.id
            LEFT JOIN users u ON u.id = ut.user_id
            LEFT JOIN team_shares tsd1 ON (tsd1.shared_id = ddwq.id AND tsd1.shared_entity = 2)
            LEFT JOIN teams td1 ON td1.id = tsd1.team_id
            LEFT JOIN user_teams utd1 ON utd1.team_id = td1.id
            LEFT JOIN users ud1 ON ud1.id = utd1.user_id
            LEFT JOIN team_shares tsd2 ON (tsd2.shared_id = ddd.id AND tsd2.shared_entity = 2)
            LEFT JOIN teams td2 ON td2.id = tsd2.team_id
            LEFT JOIN user_teams utd2 ON utd2.team_id = td2.id
            LEFT JOIN users ud2 ON ud2.id = utd2.user_id
            LEFT JOIN team_shares tsd3 ON (ts.shared_id = ddwv.id AND ts.shared_entity = 2)
            LEFT JOIN teams td3 ON td3.id = tsd3.team_id
            LEFT JOIN user_teams utd3 ON utd3.team_id = td3.id
            LEFT JOIN users ud3 ON ud1.id = utd3.user_id
            WHERE users.email = '{}'
            OR '{}' = ANY (s.shared_to)
            OR 'all' = ANY (s.shared_to)
            OR '{}' = ANY (ddwq.shared_to)
            OR 'all' = ANY (ddwq.shared_to)
            OR '{}' = ANY (ddwv.shared_to)
            OR 'all' = ANY (ddwv.shared_to)
            OR '{}' = ANY (ddd.shared_to)
            OR 'all' = ANY (ddd.shared_to)
            OR '{}' = u.email
            OR '{}' = ud1.email
            OR '{}' = ud2.email
            OR '{}' = ud3.email
            GROUP BY s.id))", user_email, user_email, user_email, user_email, user_email, user_email, user_email, user_email, user_email)
    }
}

impl Visualization {
    pub fn delete_by_question_id(conn: &mut PgConnection, qid: i64) -> Result<usize, Error> {
        diesel::delete(visualizations::table.filter(visualizations::question_id.eq(qid)))
            .execute(conn)
    }
    pub fn find_scoped(
        conn: &mut PgConnection,
        id: i64,
        user_email: String,
        permissions: Vec<PermissionNames>,
    ) -> Result<Self, Error> {
        visualizations::table
            .filter(sql::<Bool>(
                visualizations::table::shared_with_user(user_email, permissions).as_str(),
            ))
            .filter(visualizations::id.eq(id))
            .first::<Self>(conn)
    }
    pub fn find_by_question_id(conn: &mut PgConnection, qid: i64) -> Result<Vec<Self>, Error> {
        visualizations::table
            .filter(visualizations::question_id.eq(qid))
            .load::<Self>(conn)
    }

    pub fn search(
        conn: &mut PgConnection,
        q: String,
        user_email: String,
        permissions: Vec<PermissionNames>,
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
