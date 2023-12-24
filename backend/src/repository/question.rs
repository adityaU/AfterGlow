use super::models::User;

use super::models::Question;





use super::schema::{questions, tag_questions};

use diesel::dsl::sql;



use diesel::JoinOnDsl;
use diesel::NullableExpressionMethods;
use diesel::PgTextExpressionMethods;



use diesel::result::Error;



use diesel::sql_types::Bool;


use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};
use serde_json::{Map, Value};

const INDEX_LIMIT: i64 = 20;

pub struct QuestionWithUser {
    pub question: Question,
    pub user: User,
}

impl questions::table {
    pub fn shared_with_user(user_email: String, permissions: Vec<String>) -> String {
        if permissions.contains(&"Settings.all".to_string()) {
            return "questions.id = ANY(select questions.id from questions)".into();
        }

        let q = format!("questions.id = ANY(SELECT s.id
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
            GROUP BY s.id)", user_email, user_email, user_email, user_email, user_email);
        println!("{}", q);
        q
    }
}

impl Question {
    pub fn extract_from_db_config(&self, prop: &str) -> String {
        let empty_map = Map::new();
        let empty_string_value = Value::String("".to_string());
        let empty_string = "".to_string();

        let db_config = self.extract_db_config();

        match db_config
            .unwrap_or(empty_map)
            .get(prop)
            .unwrap_or(&empty_string_value)
        {
            Value::String(s) => s.clone(),
            _ => empty_string,
        }
    }

    pub fn extract_db_config(&self) -> Option<Map<String, Value>> {
        let db_config =
            if let Value::Object(human_sql) = self.human_sql.as_ref().unwrap_or(&Value::Null) {
                if let Value::Object(config) = &human_sql.get("database").unwrap_or(&Value::Null) {
                    Some(config)
                } else {
                    None
                }
            } else {
                None
            };
        db_config.map(|r| r.clone())
    }

    pub fn find_by_tag_id(
        conn: &mut PgConnection,
        tag: i32,
        user_email: String,
        permissions: Vec<String>,
    ) -> Result<Vec<Self>, Error> {
        questions::table
            .inner_join(
                tag_questions::table.on(questions::id.nullable().eq(tag_questions::question_id)),
            )
            .filter(sql::<Bool>(
                questions::table::shared_with_user(user_email, permissions).as_str(),
            ))
            .filter(tag_questions::tag_id.eq(tag))
            .order(questions::updated_at.desc())
            .select(questions::all_columns)
            .limit(INDEX_LIMIT)
            .load::<Self>(conn)
    }

    pub fn search_question(
        conn: &mut PgConnection,
        q: String,
        user_email: String,
        permissions: Vec<String>,
    ) -> Result<Vec<Self>, Error> {
        questions::table
            .filter(sql::<Bool>(
                questions::table::shared_with_user(user_email, permissions).as_str(),
            ))
            .filter(questions::title.ilike(format!("%{}%", q)))
            .order(questions::updated_at.desc())
            .limit(INDEX_LIMIT)
            .load::<Self>(conn)
    }

    pub fn search_question_with_tag(
        conn: &mut PgConnection,
        q: String,
        tag: i32,
        user_email: String,
        permissions: Vec<String>,
    ) -> Result<Vec<Self>, Error> {
        questions::table
            .filter(sql::<Bool>(
                questions::table::shared_with_user(user_email, permissions).as_str(),
            ))
            .filter(questions::title.ilike(format!("%{}%", q)))
            .inner_join(
                tag_questions::table.on(questions::id.nullable().eq(tag_questions::question_id)),
            )
            .filter(tag_questions::tag_id.eq(tag))
            .select(questions::all_columns)
            .order(questions::updated_at.desc())
            .limit(INDEX_LIMIT)
            .load::<Self>(conn)
    }

    pub fn search(
        conn: &mut PgConnection,
        q: String,
        tag: i32,
        user_email: String,
        permissions: Vec<String>,
    ) -> Result<Vec<Self>, Error> {
        match (q.as_str(), tag) {
            ("", 0) => Self::sorted_index(conn, user_email, permissions),
            ("", t) => Self::find_by_tag_id(conn, t, user_email, permissions),
            (q, 0) => Self::search_question(conn, q.to_string(), user_email, permissions),
            (q, tag) => {
                Self::search_question_with_tag(conn, q.to_string(), tag, user_email, permissions)
            }
        }
    }

    pub fn sorted_index(
        conn: &mut PgConnection,
        user_email: String,
        permissions: Vec<String>,
    ) -> Result<Vec<Self>, Error> {
        let query = questions::table
            .filter(sql::<Bool>(
                questions::table::shared_with_user(user_email, permissions).as_str(),
            ))
            .order(questions::updated_at.desc())
            .limit(INDEX_LIMIT)
            .load::<Self>(conn);
        println!("{:?}", query);
        query
    }
}
