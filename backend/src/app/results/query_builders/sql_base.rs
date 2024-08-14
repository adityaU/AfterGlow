use fancy_regex::Regex;

use diesel::PgConnection;

use serde::{Deserialize, Serialize};
use serde_json::Value;

use lazy_static::lazy_static;
use tera::{Context, Tera};

lazy_static! {
    static ref SNIPPET_RE: Regex = Regex::new(r"\{\{ *sn:.*?(?<snippet_id>\d+) *\}\}").unwrap();
}

lazy_static! {
    static ref QUES_RE: Regex = Regex::new(r"\{\{ *ques:(?<question_id>\d+) *\}\}").unwrap();
}

lazy_static! {
    static ref LIMIT_OFFSET_REGEX: Regex =
        Regex::new("(limit|LIMIT) +(\\d+) +(offset|OFFSET) +(\\d+)$").unwrap();
}
lazy_static! {
    static ref LIMIT_REGEX: Regex = Regex::new("(limit|LIMIT) +(\\d+)$").unwrap();
}

lazy_static! {
    pub static ref VARIABLE_REGEX: Regex = Regex::new(r"\{\{\s*([^{}]+)\s*\}\}").unwrap();
}

lazy_static! {
    pub static ref SYSTEM_VARIABLE_REGEX: Regex =
        Regex::new(r"\{\{\s*(SYS|sys)::([^{}]+)\s*\}\}").unwrap();
}

lazy_static! {
    pub static ref ALLOWED_VAR_NAMES_REGEX: Regex = Regex::new(r"[^\w]").unwrap();
}

use crate::app::gen_ai;
use crate::app::questions::config::{self, GenAIPrompt};

use crate::app::results::payload_adapter::Variable;
use crate::app::results::query_terms::filters::{DateObjectInner, DurationType};
use crate::app::results::{
    helpers::make_alias,
    payload_adapter::QueryTerms,
    query_terms::{
        filters::Filter,
        groups::Grouping,
        sorts::Sort,
        views::{Column, View},
    },
};
use crate::repository::models::{
    Question, Snippet, SupportedDatabases, SystemVariable, VariableType,
};

use super::super::AdaptedPayload;

use super::super::query_terms::{
    filters::FilterOperator,
    groups::GroupDuration,
    sorts::SortDirection::{Ascending, Descending},
    views::ViewAggregations,
};
use super::Queries;

#[derive(Debug, Serialize, Deserialize)]
pub struct SQLQueryOptions {
    table: String,
    filters: String,
    views: String,
    groupings: String,
    sorts: String,
    limit: Option<i64>,
    offset: Option<i64>,
}

pub struct Postgres {
    pub inner: AdaptedPayload, // ...
}

pub trait SQlBased {
    async fn generate_from_gen_ai(
        conn: &mut PgConnection,
        query: String,
        prompt: GenAIPrompt,
        db_type: SupportedDatabases,
        user_id: i64,
        org_id: i64,
    ) -> String {
        if prompt.request.is_none() || prompt.request.clone().unwrap_or_default().is_empty() {
            return query;
        }
        let prompt = format!(
            "wrap following {:?} query:\n {} to accomplish following\n{}\n my original query returns following columns:\n{}",
            db_type, query, prompt.request.unwrap_or_default(), prompt.columns.unwrap_or_default().join(",")
        );
        match gen_ai::call(
            conn,
            user_id,
            org_id,
            prompt,
            gen_ai::DATABASE_EXPERT_SYSTEM_PROMPT,
        )
        .await
        {
            Ok(resp) => resp,
            Err(_err) => query,
        }
    }
    fn new(adapted_payload: AdaptedPayload) -> Self;
    fn apply_limit(query: String, limit: i64) -> String {
        if LIMIT_OFFSET_REGEX.is_match(query.as_str()).is_ok() {
            return LIMIT_OFFSET_REGEX
                .replace_all(query.as_str(), |captures: &fancy_regex::Captures| {
                    if limit < captures[2].parse::<i64>().unwrap_or(limit + 1) {
                        format!("LIMIT {} OFFSET {}", limit, &captures[4])
                    } else {
                        format!("LIMIT {} OFFSET {}", &captures[2], &captures[4])
                    }
                })
                .to_string();
        }
        if LIMIT_REGEX.is_match(query.as_str()).is_ok() {
            return LIMIT_REGEX
                .replace_all(query.as_str(), |captures: &fancy_regex::Captures| {
                    if limit < captures[2].parse::<i64>().unwrap_or(limit + 1) {
                        format!("LIMIT {}", limit)
                    } else {
                        format!("LIMIT {}", &captures[2])
                    }
                })
                .to_string();
        }
        format!("{} limit {}", query, limit)
    }
    fn replace_system_variables(conn: &mut PgConnection, query: String) -> String {
        let mut replacements = Context::new();
        let system_variables = SystemVariable::index(conn);

        let mut variable_sanitized_query = query.clone();

        VARIABLE_REGEX
            .captures_iter(query.as_str())
            .for_each(|captures| {
                sanitize_query(
                    captures,
                    &mut replacements,
                    &mut variable_sanitized_query,
                    &query,
                );
            });
        match system_variables {
            Ok(system_variables) => {
                for variable in system_variables {
                    let value_string = String::from_utf8(variable.value).unwrap_or_default();
                    let value_string = if value_string.is_empty() {
                        None
                    } else {
                        Some(value_string)
                    };

                    let variable_name = ALLOWED_VAR_NAMES_REGEX
                        .replace_all(variable.name.trim(), "_")
                        .to_string();
                    let var_name1 = format!("sys__{}", variable_name);
                    let var_name2 = format!("SYS__{}", variable_name);
                    replacements.insert(var_name1, &value_string);
                    replacements.insert(var_name2, &value_string);
                }
            }
            Err(_err) => {
                return query;
            }
        }

        render_template(variable_sanitized_query, replacements, query)
    }
    fn replace_variables(
        conn: &mut PgConnection,
        query: String,
        variables: &Vec<Variable>,
    ) -> String {
        let query = Self::replace_snippets_and_ques_defs(conn, query.clone());
        let mut replacements = Context::new();

        let mut variable_sanitized_query = query.clone();

        VARIABLE_REGEX
            .captures_iter(query.as_str())
            .for_each(|captures| {
                sanitize_query(
                    captures,
                    &mut replacements,
                    &mut variable_sanitized_query,
                    &query,
                );
            });
        for variable in variables {
            let value = match &variable.value {
                Value::Bool(b) => b.to_string(),
                Value::Number(n) => n.to_string(),
                Value::String(s) => s.to_string(),
                _ => "".to_string(),
            };

            let value = match &variable.var_type {
                VariableType::String => {
                    if value.is_empty() {
                        None
                    } else {
                        Some(format!(r#"'{}'"#, value))
                    }
                }
                VariableType::Integer => {
                    if value.is_empty() {
                        None
                    } else {
                        Some(format!(r#"'{}'"#, value))
                    }
                }
                VariableType::Date => {
                    if value.is_empty() {
                        None
                    } else {
                        Some(format!(r#"'{}'"#, value))
                    }
                }
            };

            let variable_name = ALLOWED_VAR_NAMES_REGEX
                .replace_all(variable.name.trim(), "_")
                .to_string();
            replacements.insert(variable_name, &value);
        }

        render_template(variable_sanitized_query, replacements, query)
    }
    fn build_query(table_name: &String, table_alias: String, query_terms: &QueryTerms) -> String {
        let groupings = Self::build_groupings(&query_terms.groupings, &table_alias);
        let views = Self::build_views(&query_terms.views, &table_alias);
        let groupings_with_views = if !groupings.is_empty() {
            [
                views,
                groupings
                    .iter()
                    .map(|(grouping, alias)| match alias {
                        Some(a) => format!("{} as {}", grouping, a),
                        None => grouping.to_owned(),
                    })
                    .collect::<Vec<String>>()
                    .join(", "),
            ]
            .iter()
            .filter(|s| !s.is_empty())
            .map(|s| s.to_owned())
            .collect::<Vec<String>>()
            .join(", ")
        } else {
            views
        };
        Self::make_query(SQLQueryOptions {
            table: table_name.clone(),
            filters: Self::build_filters(&query_terms.filters, &table_alias),
            views: groupings_with_views,
            groupings: groupings
                .iter()
                .map(|(grouping, _)| grouping.clone())
                .collect::<Vec<String>>()
                .join(", "),
            sorts: Self::build_sorts(&query_terms.sortings, &table_alias),
            limit: query_terms.limit,
            offset: query_terms.offset,
        })
    }
    fn build_qb(
        table: &Option<config::Table>,
        question_query_terms: &QueryTerms,
        visualization_query_terms: &QueryTerms,
    ) -> Result<Queries, String> {
        let t = table.as_ref().ok_or("Please Select a table".to_string())?;
        let table_alias = make_alias(&t.name.clone().unwrap_or_default());
        let query = Self::build_query(
            &format!(
                " {}  as {}",
                &t.name.clone().unwrap_or_default(),
                table_alias
            ),
            table_alias,
            question_query_terms,
        );

        if visualization_query_terms.is_empty() {
            return Ok(Queries {
                adapted_query: query.clone(),
                debug_query: query.clone(),
                db_query: query.clone(),
            });
        }
        let debug_query = Self::build_query(
            &format!(" ( {} )  as {}", &query, "rq"),
            "rq".to_string(),
            visualization_query_terms,
        );
        Ok(Queries {
            adapted_query: query.clone(),
            debug_query: debug_query.clone(),
            db_query: debug_query.clone(),
        })
    }

    fn build_raw(
        visualization_query_terms: &QueryTerms,
        raw_query: &String,
    ) -> Result<Queries, String> {
        if visualization_query_terms.is_empty() {
            return Ok(Queries {
                adapted_query: raw_query.clone(),
                debug_query: raw_query.clone(),
                db_query: raw_query.clone(),
            });
        }
        let debug_query = Self::build_query(
            &format!(" ( {} )  as {}", &raw_query, "rq"),
            "rq".to_string(),
            visualization_query_terms,
        );

        Ok(Queries {
            adapted_query: raw_query.clone(),
            db_query: debug_query.clone(),
            debug_query,
        })
    }

    fn build_filters(filters: &Vec<Filter>, table_alias: &String) -> String {
        use crate::app::results::query_terms::filters::Filter::*;
        filters
            .iter()
            .map(|filter| match filter {
                Raw { value } => value.clone(),
                QBDatetime {
                    column,
                    operator,
                    value,
                } => Self::make_datetime_filter_query(column, operator, value, table_alias),
                QB {
                    column,
                    operator,
                    value,
                } => Self::make_filter_query(column, operator, value, table_alias),
                Invalid => "w".to_string(),
            })
            .collect::<Vec<String>>()
            .join(" and ")
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

    fn build_sorts(sortings: &Vec<Sort>, table_alias: &String) -> String {
        use crate::app::results::query_terms::sorts::Sort::*;
        sortings
            .iter()
            .map(|sort| match sort {
                Raw { value } => value.clone(),
                QB { column, direction } => match direction {
                    Ascending => format!(
                        "{} ASC",
                        Self::aliased_column(column.as_str(), table_alias.as_str())
                    ),
                    Descending => format!(
                        "{} DESC",
                        Self::aliased_column(column.as_str(), table_alias.as_str())
                    ),
                },
                Invalid => "".to_string(),
            })
            .collect::<Vec<String>>()
            .join(", ")
    }

    fn build_groupings(
        groupings: &Vec<Grouping>,
        table_alias: &String,
    ) -> Vec<(String, Option<String>)> {
        use crate::app::results::query_terms::groups::Grouping::*;
        groupings
            .iter()
            .map(|grouping| match grouping {
                Raw { value } => (value.clone(), None),
                QB { column } => (
                    Self::aliased_column(column.as_str(), table_alias.as_str()),
                    None,
                ),
                QBDatetime { column, duration } => {
                    Self::make_datetime_groupby_query(column, duration, table_alias)
                }
                Invalid => ("".to_string(), None),
            })
            .collect::<Vec<(String, _)>>()
    }

    fn make_aggregate_view_query(
        agg: &ViewAggregations,
        column: &String,
        value: &Option<f64>,
        table_alias: &String,
    ) -> String {
        use ViewAggregations::*;
        let aliased_column = Self::aliased_column(column.as_str(), table_alias.as_str());
        match agg {
            CountOfRows => match column.as_str() {
                "all" => "count(*) as count".to_string(),
                col => format!("count({}) as \"count of {}\"", aliased_column, col),
            },
            MinimumOf => format!("min({}) as \"min of {}\"", aliased_column, column),
            MaximumOf => format!("max({}) as \"min of {}\"", aliased_column, column),
            SumOf => format!("sum({}) as \"sum of {}\"", aliased_column, column),
            AverageOf => format!("avg({}) as \"avg of {}\"", aliased_column, column),
            PercentileOf => format!(
                "percentile_cont({}) within group (order by {}) as \"{}th percentile of {}\"",
                value.unwrap_or(0.0) / 100.0,
                aliased_column,
                value.unwrap_or(0.0),
                column
            ),
            StandardDeviation => {
                format!(
                    "stddev({}) as \"standard deviation of {}\"",
                    aliased_column, column
                )
            }
            StandardVariance => {
                format!(
                    "variance({}) \"standard variance of {}\"",
                    aliased_column, column
                )
            }
            Invalid => "".to_string(),
        }
    }

    fn make_datetime_filter_query(
        column: &String,
        operator: &FilterOperator,
        value: &DateObjectInner,
        table_alias: &String,
    ) -> String {
        use FilterOperator::*;
        let aliased_column = Self::aliased_column(column.as_str(), table_alias.as_str());

        let val = match value {
            DateObjectInner::DatePicker(v) => {
                match chrono::NaiveDateTime::parse_from_str(v, "format ") {
                    Ok(dt) => dt.format("format ").to_string(),
                    Err(_) => "invalid date".to_string(),
                }
            }

            DateObjectInner::DurationPicker {
                duration_value,
                duration_type,
                duration_tense,
            } => {
                use crate::app::results::query_terms::filters::DurationTenseType::*;

                let op = match duration_tense {
                    Ago => "-",
                    Later => "+",
                };

                Self::query_fragment_on_duration_type(duration_type, op, duration_value)
            }
        };

        match operator {
            Equal => format!("{} = {}", aliased_column, val),
            NotEqual => format!("{} != {}", aliased_column, val),
            GreaterThan => format!("{} > {}", aliased_column, val),
            LessThan => format!("{} < {}", aliased_column, val),
            GreaterThanOrEqual => format!("{} >= {}", aliased_column, val),
            LessThanOrEqual => format!("{} <= {}", aliased_column, val),
            IsNull => format!("{} is null", aliased_column),
            IsNotNull => format!("{} is not null", aliased_column),
            _ => "INVALID DATE COMPARISON".to_string(),
        }
    }
    fn query_fragment_on_duration_type(
        duration_type: &DurationType,
        op: &str,
        duration_value: &i32,
    ) -> String {
        use crate::app::results::query_terms::filters::DurationType::*;
        match duration_type {
            Seconds => format!("now() {} INTERVAL '{} seconds'", op, duration_value),
            Minutes => format!("now() {} INTERVAL '{} minutes'", op, duration_value),
            Hours => format!("now() {} INTERVAL '{} hours'", op, duration_value),
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

    fn make_filter_query(
        column: &str,
        operator: &FilterOperator,
        val: &Option<serde_json::value::Value>,
        table_alias: &str,
    ) -> String {
        use serde_json::value::Value::*;
        use FilterOperator::*;
        let aliased_column = Self::aliased_column(column, table_alias);
        let value = match val {
            Some(v) => match v {
                Null => "".to_string(),
                Bool(b) => format!("{}", b),
                Number(n) => format!("{}", n),
                String(s) => match operator {
                    Matches | StartsWith | EndsWith => s.to_string(),
                    _ => format!("'{}'", s),
                },
                _ => return "".to_string(),
            },
            None => "".to_string(),
        };
        match operator {
            Equal => format!("{} = {}", aliased_column, value),
            NotEqual => format!("{} != {}", aliased_column, value),
            GreaterThan => format!("{} > {}", aliased_column, value),
            LessThan => format!("{} < {}", aliased_column, value),
            GreaterThanOrEqual => format!("{} >= {}", aliased_column, value),
            LessThanOrEqual => format!("{} <= {}", aliased_column, value),
            In => format!("{} in ({})", aliased_column, value),
            NotIn => format!("{} not in ({})", aliased_column, value),
            IsNull => format!("{} is null", aliased_column),
            IsNotNull => format!("{} is not null", aliased_column),
            Matches => format!(
                "lower({}) like '%{}%'",
                aliased_column,
                value.to_lowercase()
            ),
            StartsWith => format!("lower({}) like '{}%'", aliased_column, value.to_lowercase()),
            EndsWith => format!("lower({}) like '%{}'", aliased_column, value.to_lowercase()),
            Invalid => "INVALID COMPARISON".to_string(),
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
                format!("date_trunc('second', {})", aliased_column),
                Some(format!(" \"{} by Seconds\"", column)),
            ),
            ByMinute => (
                format!("date_trunc('minute', {})", aliased_column),
                Some(format!("\"{} by Minute\"", column)),
            ),
            ByDay => (
                format!("CAST({} AS date)", aliased_column),
                Some(format!(" \"{} by Day\"", column)),
            ),
            ByHour => (
                format!("date_trunc('hour', {}) ", aliased_column),
                Some(format!("\"{} by Hour\"", column)),
            ),
            ByWeek => (
                format!(
                    "date_trunc('week', ({} + INTERVAL '1 day')) - INTERVAL '1 day')",
                    aliased_column
                ),
                Some(format!("\"{}  by Week\"", column)),
            ),
            ByMonth => (
                format!("date_trunc('month', {})", aliased_column),
                Some(format!("\"{} by month\"", column)),
            ),
            ByQuarter => (
                format!("date_trunc('quarter', {})", aliased_column),
                Some(format!("\"{} by Quarter\"", column)),
            ),
            ByYear => (
                format!("CAST(extract(year from {}) AS integer)", aliased_column),
                Some(format!("\"{}  by Year\"", column)),
            ),
            ByHourOfTheDay => (
                format!("CAST(extract(hour from {}) AS integer)", aliased_column),
                Some(format!("\"{}  by hour of the day\"", column)),
            ),
            ByDayOfTheWeek => (
                format!(
                    "(CAST(extract(dow from {}) AS integer) + 1)",
                    aliased_column
                ),
                Some(format!("\"#{}  by day of the week\"", column)),
            ),
            ByDayOfTheMonth => (
                format!("CAST(extract(day from {}) AS integer)", aliased_column),
                Some(format!("\"{}  by day of the month\"", column)),
            ),
            ByWeekOfYear => (
                format!(
                    "CAST(extract(week from ({} + INTERVAL '1 day')) AS integer)",
                    aliased_column
                ),
                Some(format!("\"#{}  by week of the year\"", column)),
            ),
            ByMonthOfYear => (
                format!("CAST(extract(month from {}) AS integer)", aliased_column),
                Some(format!("\"{}  by month of the year\"", column)),
            ),
            ByQuarterOfYear => (
                format!("CAST(extract(quarter from {}) AS integer)", aliased_column),
                Some(format!("\"{}  by quarter of the year\"", column)),
            ),
            Invalid => todo!(),
        }
    }
    fn replace_snippets_and_ques_defs(conn: &mut PgConnection, query: String) -> String {
        let mut query = query.clone();
        for capture in SNIPPET_RE
            .captures_iter(query.clone().as_str())
            .filter_map(Result::ok)
        {
            let snippet_id = capture
                .name("snippet_id")
                .map_or(0_i64, |m| m.as_str().parse::<i64>().unwrap_or(0));
            let snippet_text = Snippet::find(conn, snippet_id)
                .unwrap_or_default()
                .text
                .unwrap_or_default();
            query = query.replace(capture.get(0).unwrap().as_str(), &snippet_text);
            Self::replace_snippets_and_ques_defs(conn, query.clone());
        }

        for capture in QUES_RE
            .captures_iter(query.clone().as_str())
            .filter_map(Result::ok)
        {
            let snippet_id = capture
                .name("question_id")
                .map_or(0_i64, |m| m.as_str().parse::<i64>().unwrap_or(0));
            let question_sql = Question::find(conn, snippet_id)
                .unwrap_or_default()
                .sql
                .unwrap_or_default();
            query = query.replace(capture.get(0).unwrap().as_str(), &question_sql);
            Self::replace_snippets_and_ques_defs(conn, query.clone());
        }

        query
    }

    fn make_query(
        SQLQueryOptions {
            table,
            filters,
            views,
            groupings,
            sorts,
            limit,
            offset,
        }: SQLQueryOptions,
    ) -> String {
        let mut query = "SELECT ".to_string();
        if !views.is_empty() {
            query.push_str(views.as_str());
        } else {
            query.push('*');
        };
        query.push_str(" FROM ");

        query.push_str(table.as_str());
        if !filters.is_empty() {
            query.push_str(" WHERE ");
            query.push_str(filters.as_str());
        }

        if !groupings.is_empty() {
            query.push_str(" GROUP BY ");
            query.push_str(groupings.as_str());
        }

        if !sorts.is_empty() {
            query.push_str(" ORDER BY ");
            query.push_str(sorts.as_str());
        }

        if let Some(limit) = limit {
            query.push_str(" LIMIT ");
            query.push_str(limit.to_string().as_str());
        }

        if let Some(offset) = offset {
            query.push_str(" OFFSET ");
            query.push_str(offset.to_string().as_str());
        }

        query
    }

    fn aliased_column(column: &str, table_alias: &str) -> String {
        format!("\"{}\".\"{}\"", table_alias, column)
    }
    fn aliased_column_enum(column: &Column, table_alias: &str) -> String {
        match column {
            Column::Column(v) => Self::aliased_column(v.as_str(), table_alias),
            Column::AllColumns => format!("\"{}\".*", table_alias),
        }
    }
}

fn render_template(
    variable_sanitized_query: String,
    replacements: Context,
    query: String,
) -> String {
    let mut tera = Tera::default();
    match tera.add_raw_template("query", variable_sanitized_query.as_str()) {
        Ok(_) => match tera.render("query", &replacements) {
            Ok(q) => q,
            Err(_err) => query,
        },
        Err(_err) => query,
    }
}

fn sanitize_query(
    captures: Result<fancy_regex::Captures<'_>, fancy_regex::Error>,
    replacements: &mut Context,
    variable_sanitized_query: &mut String,
    query: &String,
) {
    if let Ok(captures) = captures {
        let orig_variable_name = &captures[1];
        let temp_var = ALLOWED_VAR_NAMES_REGEX
            .replace_all(orig_variable_name.trim(), "_")
            .to_string();
        let variable_name = temp_var.as_str();
        replacements.insert(
            variable_name.trim(),
            &("{{".to_string() + variable_name.trim() + "}}"),
        );
        *variable_sanitized_query = query
            .as_str()
            .replace(orig_variable_name, variable_name)
            .to_string();
    }
}
