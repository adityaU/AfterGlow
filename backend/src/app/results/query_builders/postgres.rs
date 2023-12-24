use std::collections::HashMap;
use std::fmt;

extern crate regex;

use regex::Regex;

use chrono::{DateTime, NaiveDate, NaiveDateTime, NaiveTime, Utc};

use diesel::PgConnection;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use serde_json::Value;

use uuid::Uuid;

const LIMIT_OFFSET_REGEX: &str = "(limit|LIMIT) +(\\d+) +(offset|OFFSET) +(\\d+)$";
const LIMIT_REGEX: &str = "(limit|LIMIT) +(\\d+)$";

use crate::app::questions::config;

use crate::app::results::payload_adapter::Variable;
use crate::app::{
    results::{
        helpers::make_alias,
        payload_adapter::QueryTerms,
        query_terms::{
            filters::Filter,
            groups::Grouping,
            sorts::Sort,
            views::{Column, View},
        },
    },
    settings::limit,
};
use crate::repository::models::VariableType;

use super::super::AdaptedPayload;

use super::super::query_terms::{
    filters::{DateObject, FilterOperator},
    groups::GroupDuration,
    sorts::SortDirection::{Ascending, Descending},
    views::ViewAggregations,
};
use super::{Queries, QueryBuilder};

pub struct Postgres {
    pub inner: AdaptedPayload, // ...
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(untagged)]
pub enum DBValue {
    Bool(Option<bool>),
    Int32(Option<i32>),
    Int64(Option<i64>),
    Int16(Option<i16>),
    Int8(Option<i8>),
    Int128(Option<i128>),
    Float32(Option<f32>),
    Float64(Option<f64>),
    Json(Option<Value>),
    Strings(Option<String>),
    VecString(Option<Vec<String>>),
    VecInt32(Option<Vec<i32>>),
    VecInt64(Option<Vec<i64>>),
    VecInt16(Option<Vec<i16>>),
    VecInt8(Option<Vec<i8>>),
    VecInt128(Option<Vec<i128>>),
    VecFloat32(Option<Vec<f32>>),
    VecFloat64(Option<Vec<f64>>),
    VecJSON(Option<Vec<Value>>),
    VecBool(Option<Vec<bool>>),
    VecDate(Option<Vec<NaiveDate>>),
    VecTime(Option<Vec<NaiveTime>>),
    VecDateTime(Option<Vec<NaiveDateTime>>),
    VecUtcDateTime(Option<Vec<DateTime<Utc>>>),
    VecUUID(Option<Vec<Uuid>>),
    Date(Option<NaiveDate>),
    Time(Option<NaiveTime>),
    DateTime(Option<NaiveDateTime>),
    UtcDateTime(Option<DateTime<Utc>>),
    Uuid(Option<Uuid>),
    Decimal(Option<Decimal>),
    VecDecimal(Option<Vec<Decimal>>),
}

impl fmt::Display for DBValue {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            // For single values
            DBValue::Bool(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Int32(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Int64(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Int16(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Int8(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Int128(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Float32(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Float64(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Json(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Strings(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Date(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Time(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::DateTime(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::UtcDateTime(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Uuid(v) => write!(f, "{}", opt_to_string(v)),
            DBValue::Decimal(v) => write!(f, "{}", opt_to_string(v)),

            // For vector values
            DBValue::VecString(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecInt32(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecInt64(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecInt16(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecInt8(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecInt128(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecFloat32(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecFloat64(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecJSON(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecBool(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecDate(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecTime(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecDateTime(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecUtcDateTime(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecUUID(v) => write!(f, "{}", vec_opt_to_string(v)),
            DBValue::VecDecimal(v) => write!(f, "{}", vec_opt_to_string(v)),
        }
    }
}

// Helper function for single value variants
fn opt_to_string<T: ToString>(opt: &Option<T>) -> String {
    match opt {
        Some(val) => val.to_string(),
        None => "null".to_string(),
    }
}

// Helper function for vector value variants
fn vec_opt_to_string<T: ToString>(opt: &Option<Vec<T>>) -> String {
    match opt {
        Some(vec) => vec
            .iter()
            .map(|i| i.to_string())
            .collect::<Vec<String>>()
            .join(", "),
        None => "null".to_string(),
    }
}

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

impl QueryBuilder for Postgres {
    fn build(&self, conn: &mut PgConnection, user_id: i32, org_id: i64) -> Result<Queries, String> {
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

        queries.final_query = Self::replace_variables(queries.final_query, variables);
        queries.final_query = Self::apply_limit(
            queries.final_query,
            limit::applicable_frontend_limit(conn, user_id, org_id),
        );
        Ok(queries)
    }
}

impl Postgres {
    pub fn new(adapted_payload: AdaptedPayload) -> Self {
        Self {
            inner: adapted_payload,
        }
    }
    fn apply_limit(query: String, limit: i64) -> String {
        let limit_offset_regex_obj: Regex = Regex::new(LIMIT_OFFSET_REGEX).unwrap();
        let limit_regex_obj: Regex = Regex::new(LIMIT_REGEX).unwrap();
        if limit_offset_regex_obj.is_match(query.as_str()) {
            return limit_offset_regex_obj
                .replace_all(query.as_str(), |captures: &regex::Captures| {
                    if limit < captures[2].parse::<i64>().unwrap_or(limit + 1) {
                        format!("LIMIT {} OFFSET {}", limit, &captures[4])
                    } else {
                        format!("LIMIT {} OFFSET {}", &captures[2], &captures[4])
                    }
                })
                .to_string();
        }
        if limit_regex_obj.is_match(query.as_str()) {
            return limit_regex_obj
                .replace_all(query.as_str(), |captures: &regex::Captures| {
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
    fn replace_variables(query: String, variables: &Vec<Variable>) -> String {
        let mut replacements: HashMap<String, String> = HashMap::new();
        for variable in variables {
            let mut value = match &variable.value {
                Value::Bool(b) => b.to_string(),
                Value::Number(n) => n.to_string(),
                Value::String(s) => s.to_string(),
                _ => "".to_string(),
            };

            value = match &variable.var_type {
                VariableType::String => format!(r#"'{}'"#, value),
                VariableType::Integer => value,
                VariableType::Date => format!(r#"'{}'"#, value),
            };

            replacements.insert(variable.name.trim().to_string(), value);
        }

        let pattern = r"\{\{\s*([^{}]+)\s*\}\}";

        let re = Regex::new(pattern).unwrap();
        re.replace_all(query.as_str(), |captures: &regex::Captures| {
            let variable_name = &captures[1];
            match replacements.get(variable_name.trim()) {
                Some(value) => value.to_string(),
                None => captures[0].to_string(),
            }
        })
        .to_string()
    }
    fn build_query(table_name: &String, table_alias: String, query_terms: &QueryTerms) -> String {
        let groupings = Self::build_groupings(&query_terms.groupings, &table_alias);
        let views = Self::build_views(&query_terms.views, &table_alias);
        let groupings_with_views = if groupings.len() > 0 {
            format!(
                "{} , {}",
                views,
                groupings
                    .iter()
                    .map(|(grouping, alias)| match alias {
                        Some(a) => format!("{} as {}", grouping, a),
                        None => grouping.to_owned(),
                    })
                    .collect::<Vec<String>>()
                    .join(", ")
            )
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
                final_query: query.clone(),
            });
        }
        Ok(Queries {
            adapted_query: query.clone(),
            final_query: Self::build_query(
                &format!(" ( {} )  as {}", &query, "rq".to_string()),
                "rq".to_string(),
                visualization_query_terms,
            ),
        })
    }

    fn build_raw(
        visualization_query_terms: &QueryTerms,
        raw_query: &String,
    ) -> Result<Queries, String> {
        if visualization_query_terms.is_empty() {
            return Ok(Queries {
                adapted_query: raw_query.clone(),
                final_query: raw_query.clone(),
            });
        }
        Ok(Queries {
            adapted_query: raw_query.clone(),
            final_query: Self::build_query(
                &format!(" ( {} )  as {}", &raw_query, "rq".to_string()),
                "rq".to_string(),
                visualization_query_terms,
            ),
        })
    }

    // fn update_row<T: Display + Serialize>(
    //     row: &mut Vec<Value>,
    //     value: Option<T>,
    //     convert_to_string: bool,
    // ) {
    //     match value {
    //         Some(v) => {
    //             if convert_to_string {
    //                 row.push(to_value(v.to_string()).unwrap_or(Value::Static(Null)));
    //             } else {
    //                 row.push(to_value(v).unwrap_or(Value::Static(Null)));
    //             }
    //         }
    //
    //         None => {
    //             row.push(Value::Null);
    //         }
    //     }
    // }

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
            .join(", ")
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
        value: &DateObject,
        table_alias: &String,
    ) -> String {
        use FilterOperator::*;
        let aliased_column = Self::aliased_column(column.as_str(), table_alias.as_str());

        let val = match value {
            DateObject::DatePicker(v) => {
                match chrono::NaiveDateTime::parse_from_str(v, "format ") {
                    Ok(dt) => dt.format("format ").to_string(),
                    Err(_) => "invalid date".to_string(),
                }
            }

            DateObject::DurationPicker {
                duration_value,
                duration_type,
                duration_tense,
            } => {
                use crate::app::results::query_terms::filters::DurationTenseType::*;
                use crate::app::results::query_terms::filters::DurationType::*;

                let op = match duration_tense {
                    Ago => "-",
                    Later => "+",
                };

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

    fn make_filter_query(
        column: &String,
        operator: &FilterOperator,
        val: &Option<serde_json::value::Value>,
        table_alias: &String,
    ) -> String {
        use serde_json::value::Value::*;
        use FilterOperator::*;
        let aliased_column = Self::aliased_column(column.as_str(), table_alias.as_str());
        let value = match val {
            Some(v) => match v {
                Null => "".to_string(),
                Bool(b) => format!("{}", b),
                Number(n) => format!("{}", n),
                String(s) => match operator {
                    Matches | StartsWith | EndsWith => format!("{}", s),
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
        column: &String,
        duration: &GroupDuration,
        table_alias: &String,
    ) -> (String, Option<String>) {
        use GroupDuration::*;
        let aliased_column = Self::aliased_column(column.as_str(), table_alias.as_str());
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
                format!("CAST(\"{}\" AS date)", aliased_column),
                Some(format!(" \"{} by Day\"", column)),
            ),
            ByHour => (
                format!("date_trunc('hour', {}) ", aliased_column),
                Some(format!("\"{} by Hour\"", column)),
            ),
            ByWeek => (
                format!(
                    "date_trunc('week', (\"{}\" + INTERVAL '1 day')) - INTERVAL '1 day')",
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
                format!("CAST(extract(year from \"{}\") AS integer)", aliased_column),
                Some(format!("\"{}  by Year\"", column)),
            ),
            ByHourOfTheDay => (
                format!("CAST(extract(hour from \"{}\") AS integer)", aliased_column),
                Some(format!("\"{}  by hour of the day\"", column)),
            ),
            ByDayOfTheWeek => (
                format!(
                    "(CAST(extract(dow from \"{}\") AS integer) + 1)",
                    aliased_column
                ),
                Some(format!("\"#{}  by day of the week\"", column)),
            ),
            ByDayOfTheMonth => (
                format!("CAST(extract(day from \"{}\") AS integer)", aliased_column),
                Some(format!("\"{}  by day of the month\"", column)),
            ),
            ByWeekOfYear => (
                format!(
                    "CAST(extract(week from (\"{}\" + INTERVAL '1 day')) AS integer)",
                    aliased_column
                ),
                Some(format!("\"#{}  by week of the year\"", column)),
            ),
            ByMonthOfYear => (
                format!(
                    "CAST(extract(month from \"{}\") AS integer)",
                    aliased_column
                ),
                Some(format!("\"{}  by month of the year\"", column)),
            ),
            ByQuarterOfYear => (
                format!(
                    "CAST(extract(quarter from \"{}\") AS integer)",
                    aliased_column
                ),
                Some(format!("\"{}  by quarter of the year\"", column)),
            ),
            Invalid => todo!(),
        }
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
        if views != "" {
            query.push_str(&views.as_str());
        } else {
            query.push_str("*");
        };
        if groupings != "" {
            query.push_str(", ");
            query.push_str(&groupings.as_str());
        }
        query.push_str(" FROM ");

        query.push_str(table.as_str());
        if filters != "" {
            query.push_str(" WHERE ");
            query.push_str(&filters.as_str());
        }

        if groupings != "" {
            query.push_str(" GROUP BY ");
            query.push_str(&groupings.as_str());
        }

        if sorts != "" {
            query.push_str(" ORDER BY ");
            query.push_str(&sorts.as_str());
        }

        if limit != None {
            query.push_str(" LIMIT ");
            query.push_str(format!("{}", &limit.unwrap().to_string()).as_str());
        }

        if offset != None {
            query.push_str(" OFFSET ");
            query.push_str(format!("{}", &offset.unwrap().to_string()).as_str());
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
