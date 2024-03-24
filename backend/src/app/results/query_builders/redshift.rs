use diesel::PgConnection;

use crate::app::{
    results::{
        payload_adapter::AdaptedPayload,
        query_terms::filters::{DurationType},
    },
    settings::limit,
};

use super::{sql_base::SQlBased, Queries, QueryBuilder};

pub struct Redshift {
    pub inner: AdaptedPayload, // ...
}

impl QueryBuilder for Redshift {
    fn build(&self, conn: &mut PgConnection, user_id: i64, org_id: i64) -> Result<Queries, String> {
        let (mut queries, variables) = match &self.inner {
            AdaptedPayload::ApiAction {
                database: _database,
                api_action: _api_action,
                variables: _variables,
            } => return Err("Api Action Queries can not be routed to postgres".to_string()),
            AdaptedPayload::Raw {
                database: _,
                raw_query,
                variables,
                visualization_query_terms,
            } => (
                Self::build_raw(visualization_query_terms, &raw_query.trim().to_string())?,
                variables,
            ),
            AdaptedPayload::QB {
                database: _,
                question_query_terms,
                table,
                variables,
                visualization_query_terms,
            } => (
                Self::build_qb(table, question_query_terms, visualization_query_terms)?,
                variables,
            ),
        };

        queries.final_query = Self::replace_variables(conn, queries.final_query, variables);
        queries.final_query = Self::apply_limit(
            queries.final_query,
            limit::applicable_frontend_limit(conn, user_id, org_id),
        );
        Ok(queries)
    }
}

impl SQlBased for Redshift {
    fn new(inner: AdaptedPayload) -> Self {
        Self { inner }
    }

    fn query_fragment_on_duration_type(
        duration_type: &DurationType,
        op: &str,
        duration_value: &i32,
    ) -> String {
        use crate::app::results::query_terms::filters::DurationType::*;
        match duration_type {
            Seconds => format!("getdate() {} INTERVAL '{} seconds'", op, duration_value),
            Minutes => format!("getdate() {} INTERVAL '{} minutes'", op, duration_value),
            Hours => format!("getdate() {} INTERVAL '{} hours'", op, duration_value),
            Days => format!("current_date {} INTERVAL '{} days'", op, duration_value),
            Weeks => format!("current_date {} INTERVAL '{} weeks'", op, duration_value),
            Months => format!("current_date {} INTERVAL '{} months'", op, duration_value),
            Quarters => format!(
                "current_date {} INTERVAL '{} months'",
                op,
                3 * duration_value
            ),
            Years => format!("current_date {} INTERVAL '{} years'", op, duration_value),
        }
    }
}
