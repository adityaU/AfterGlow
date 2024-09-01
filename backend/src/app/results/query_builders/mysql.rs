use diesel::PgConnection;

use crate::{
    app::{
        results::{
            payload_adapter::{AdaptedPayload, Variable},
            query_terms::{
                groups::GroupDuration,
                views::{Column, View},
            },
        },
        settings::limit,
    },
    repository::models::SupportedDatabases,
};

use super::{sql_base::SQlBased, Queries, QueryBuilder};

use crate::app::results::query_terms::filters::{DateObjectInner, DurationType};
pub struct Mysql {
    pub inner: AdaptedPayload, // ...
}

impl QueryBuilder for Mysql {
    async fn build(
        &self,
        conn: &mut PgConnection,
        user_id: i64,
        org_id: i64,
    ) -> Result<Queries, String> {
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

        queries.debug_query = Self::replace_variables(conn, queries.debug_query, variables);
        queries.debug_query = Self::apply_limit(
            queries.debug_query,
            limit::applicable_frontend_limit(conn, user_id, org_id),
        );

        queries.debug_query = match &self.inner {
            AdaptedPayload::ApiAction {
                database: _,
                api_action: _,
                variables: _,
            } => queries.db_query.clone(),
            AdaptedPayload::Raw {
                database: _,
                raw_query: _,
                variables: _,
                visualization_query_terms,
            } => {
                Self::generate_from_gen_ai(
                    conn,
                    queries.debug_query.clone(),
                    visualization_query_terms
                        .genai_prompt
                        .clone()
                        .unwrap_or_default(),
                    SupportedDatabases::Mysql,
                    user_id,
                    org_id,
                )
                .await
            }
            AdaptedPayload::QB {
                database: _,
                question_query_terms: _,
                table: _,
                variables: _,
                visualization_query_terms,
            } => {
                Self::generate_from_gen_ai(
                    conn,
                    queries.debug_query.clone(),
                    visualization_query_terms
                        .genai_prompt
                        .clone()
                        .unwrap_or_default(),
                    SupportedDatabases::Mysql,
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

impl SQlBased for Mysql {
    fn new(inner: AdaptedPayload) -> Self {
        Self { inner }
    }

    fn build_views(views: &Vec<View>, table_alias: &String) -> String {
        use crate::app::results::query_terms::views::View::*;
        views
            .iter()
            .map(|view| match view {
                Raw { value } => value.clone(),
                Aggregate { agg, column, value } => {
                    Self::make_aggregate_view_query(agg, column, value, table_alias)
                }
                QB { columns } => columns
                    .iter()
                    .map(|column| Self::aliased_column_enum(column, table_alias.as_str()))
                    .collect::<Vec<String>>()
                    .join(", "),
                Invalid => "".to_string(),
            })
            .collect::<Vec<String>>()
            .join(", ")
    }
    fn replace_variables(
        conn: &mut PgConnection,
        query: String,
        variables: &Vec<Variable>,
    ) -> String {
        Self::_replace_variables(conn, query, variables, "'".to_string())
    }

    fn aliased_column(column: &str, table_alias: &str) -> String {
        format!("`{}`.`{}`", table_alias, column)
    }
    fn aliased_column_enum(column: &Column, table_alias: &str) -> String {
        match column {
            Column::Column(v) => Self::aliased_column(v.as_str(), table_alias),
            Column::AllColumns => format!("`{}`.*", table_alias),
        }
    }

    fn query_fragment_on_duration_type(
        duration_type: &DurationType,
        op: &str,
        duration_value: &i32,
    ) -> String {
        use crate::app::results::query_terms::filters::DurationType::*;
        match duration_type {
            Seconds => format!("now() {} INTERVAL {} second", op, duration_value),
            Minutes => format!("now() {} INTERVAL {} minute", op, duration_value),
            Hours => format!("now() {} INTERVAL {} hour", op, duration_value),
            Days => format!("now() {} INTERVAL {} day", op, duration_value),
            Weeks => format!("now() {} INTERVAL {} week", op, duration_value),
            Months => format!("now() {} INTERVAL {} month", op, duration_value),
            Quarters => format!("now() {} INTERVAL {} quarter", op, duration_value),
            Years => format!("now() {} INTERVAL {} year", op, duration_value),
        }
    }

    fn make_datetime_groupby_query(
        column: &str,
        duration: &GroupDuration,
        table_alias: &str,
    ) -> (String, Option<String>) {
        use GroupDuration::*;
        let aliased_column = Self::aliased_column(column, table_alias);
        match duration {
            AsItIs => (aliased_column, None),
            BySeconds => (
                format!("TIMESTAMP(CONCAT(year({}),'-', month({}), '-', day({}), 'T', hour({}),':', minute({}), ':', second({})))", aliased_column, aliased_column, aliased_column, aliased_column, aliased_column, aliased_column),
                Some(format!(" \"{} by Seconds\"", column)),
            ),
            ByMinute => (
                format!("TIMESTAMP(CONCAT(year({}),'-', month({}), '-', day({}), 'T', hour({}),':', minute({}), ':00'))", aliased_column,aliased_column,aliased_column,aliased_column,aliased_column),
                Some(format!("\"{} by Minute\"", column)),
            ),
            ByDay => (
                format!(
                    "DATE(CONCAT(year({}),'-', month({}), '-', day({}), 'T00:00:00'))",
                    aliased_column, aliased_column, aliased_column
                ),
                Some(format!(" \"{} by Day\"", column)),
            ),
            ByHour => (
                format!("TIMESTAMP(CONCAT(year({}),'-', month({}), '-', day({}), 'T', hour({}),':00:00'))", aliased_column, aliased_column, aliased_column, aliased_column),
                Some(format!("\"{} by Hour\"", column)),
            ),
            ByWeek => (
                format!(
                    "CONCAT(year({}),', Week: ', week({}))",
                    aliased_column, aliased_column
                ),
                Some(format!("\"{}  by Week\"", column)),
            ),
            ByMonth => (
                format!("DATE(CONCAT(year({}),'-', month({}), '-01T00:00:00'))", aliased_column, aliased_column),
                Some(format!("\"{} by month\"", column)),
            ),
            ByQuarter => (
                format!("CONCAT(year({}),', Quarter: ', quarter({}))", aliased_column, aliased_column),
                Some(format!("\"{} by Quarter\"", column)),
            ),
            ByYear => (
                format!("year({})", aliased_column),
                Some(format!("\"{}  by Year\"", column)),
            ),
            ByHourOfTheDay => (
                format!("hour({})", aliased_column),
                Some(format!("\"{}  by hour of the day\"", column)),
            ),
            ByDayOfTheWeek => (
                format!(
                    "dayofweek({})",
                    aliased_column
                ),
                Some(format!("\"#{}  by day of the week\"", column)),
            ),
            ByDayOfTheMonth => (
                format!("dayofmonth({})", aliased_column),
                Some(format!("\"{}  by day of the month\"", column)),
            ),
            ByWeekOfYear => (
                format!(
                    "weekofyear({})",
                    aliased_column
                ),
                Some(format!("\"#{}  by week of the year\"", column)),
            ),
            ByMonthOfYear => (
                format!("month({})", aliased_column),
                Some(format!("\"{}  by month of the year\"", column)),
            ),
            ByQuarterOfYear => (
                format!("quarter({})", aliased_column),
                Some(format!("\"{}  by quarter of the year\"", column)),
            ),
            Invalid => todo!(),
        }
    }
}
