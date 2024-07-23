use super::models::Question;

use super::permissions::PermissionNames;
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

const DEFAULT_SORT_COLUMN: &str = "created_at";

impl questions::table {
    pub fn shared_with_user(user_email: String, permissions: Vec<PermissionNames>) -> String {
        if permissions.contains(&PermissionNames::SettingsAll) {
            return "questions.id = ANY(select questions.id from questions)".into();
        }

        format!("questions.id = ANY(SELECT s.id
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
            GROUP BY s.id)", user_email, user_email, user_email, user_email, user_email, user_email, user_email, user_email, user_email)
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

    pub fn find_shared(
        conn: &mut PgConnection,
        question_id: i64,
        user_email: String,
        permissions: Vec<PermissionNames>,
    ) -> Result<Self, Error> {
        questions::table
            .filter(sql::<Bool>(
                questions::table::shared_with_user(user_email, permissions).as_str(),
            ))
            .filter(questions::id.eq(question_id))
            .order(questions::updated_at.desc())
            .select(questions::all_columns)
            .first::<Self>(conn)
    }

    pub fn find_by_tag_id(
        conn: &mut PgConnection,
        tag: i64,
        user_email: String,
        permissions: Vec<PermissionNames>,
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
        permissions: Vec<PermissionNames>,
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
        tag: i64,
        user_email: String,
        permissions: Vec<PermissionNames>,
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
        tag: i64,
        user_email: String,
        permissions: Vec<PermissionNames>,
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
        permissions: Vec<PermissionNames>,
    ) -> Result<Vec<Self>, Error> {
        let query = questions::table
            .filter(sql::<Bool>(
                questions::table::shared_with_user(user_email, permissions).as_str(),
            ))
            .order(questions::updated_at.desc())
            .limit(INDEX_LIMIT)
            .load::<Self>(conn);
        query
    }
}
