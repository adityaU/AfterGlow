use diesel::PgConnection;

use crate::{
    app::{results::payload_adapter::AdaptedPayload, settings::limit},
    repository::models::SupportedDatabases,
};

use super::{sql_base::SQlBased, Queries, QueryBuilder};

pub struct Postgres {
    pub inner: AdaptedPayload, // ...
}

impl QueryBuilder for Postgres {
    async fn build(
        &self,
        conn: &mut PgConnection,
        user_id: i64,
        org_id: i64,
    ) -> Result<Queries, String> {
        let (mut queries, variables) = match &self.inner {
            AdaptedPayload::ApiAction { .. } => {
                return Err("Api Action Queries cannot be routed to postgres".to_string());
            }
            AdaptedPayload::Raw {
                raw_query,
                variables,
                visualization_query_terms,
                ..
            } => (
                Self::build_raw(visualization_query_terms, &raw_query.trim().to_owned())?,
                variables,
            ),
            AdaptedPayload::QB {
                question_query_terms,
                table,
                variables,
                visualization_query_terms,
                ..
            } => (
                Self::build_qb(table, question_query_terms, visualization_query_terms)?,
                variables,
            ),
        };

        queries.debug_query = Self::replace_variables(conn, queries.debug_query, variables);
        queries.debug_query = Self::apply_limit(
            queries.debug_query,
            limit::applicable_frontend_limit(conn, user_id, org_id),
        );

        queries.debug_query = match &self.inner {
            AdaptedPayload::ApiAction { .. } => queries.db_query.clone(),
            AdaptedPayload::Raw {
                visualization_query_terms,
                ..
            }
            | AdaptedPayload::QB {
                visualization_query_terms,
                ..
            } => {
                Self::generate_from_gen_ai(
                    conn,
                    queries.debug_query.clone(),
                    visualization_query_terms
                        .genai_prompt
                        .clone()
                        .unwrap_or_default(),
                    SupportedDatabases::Postgres,
                    user_id,
                    org_id,
                )
                .await
            }
        };

        queries.db_query = Self::replace_system_variables(conn, queries.debug_query.clone());
        Ok(queries)
    }
}

impl SQlBased for Postgres {
    fn new(inner: AdaptedPayload) -> Self {
        Self { inner }
    }
}
