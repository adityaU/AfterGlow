use serde::{Deserialize, Serialize};

use crate::{
    app::questions::config,
    repository::models::{ApiActionChangeset, VariableType},
};

use super::query_terms::{
    filters::{make_filters, Filter},
    groups::{make_groupings, Grouping},
    sorts::{make_sorts, Sort},
    views::{make_views, View},
};

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Variable {
    pub name: String,
    pub value: serde_json::value::Value,
    pub var_type: VariableType,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub enum AdaptedPayload {
    ApiAction {
        database: config::Database,
        api_action: ApiActionChangeset,
        variables: Vec<Variable>,
    },
    Raw {
        database: config::Database,
        raw_query: String,
        variables: Vec<Variable>,
        visualization_query_terms: QueryTerms,
    },

    QB {
        database: config::Database,
        question_query_terms: QueryTerms,
        table: Option<config::Table>,
        variables: Vec<Variable>,
        visualization_query_terms: QueryTerms,
    },
}

impl AdaptedPayload {
    pub fn new(payload: config::QuestionHumanSql) -> AdaptedPayload {
        if payload
            .database
            .as_ref()
            .unwrap_or(&config::Database::default())
            .db_type
            == "api_client".to_string()
        {
            return AdaptedPayload::ApiAction {
                database: payload.database.unwrap_or_default(),
                api_action: payload.api_action.unwrap_or_default(),
                variables: make_variable(&payload.variables.unwrap_or_default()),
            };
        }
        match payload.query_type.unwrap_or_default() {
            config::QueryType::Raw => AdaptedPayload::Raw {
                database: payload.database.unwrap_or_default(),
                raw_query: payload
                    .raw_query
                    .unwrap_or("".to_string())
                    .trim_end_matches(";")
                    .to_string(),
                variables: make_variable(&payload.variables.unwrap_or_default()),
                visualization_query_terms: QueryTerms::new(
                    match payload
                        .visualization
                        .unwrap_or(config::Visualization::default())
                        .query_terms
                    {
                        config::QueryTermDetails::QueryTermsUnderDetails { details: qt } => qt,
                        config::QueryTermDetails::QueryTerms(qt) => qt,
                    },
                ),
            },
            config::QueryType::QueryBuilder => AdaptedPayload::QB {
                database: payload.database.unwrap_or_default(),
                question_query_terms: QueryTerms::new(config::QueryTerms {
                    filters: payload
                        .filters
                        .unwrap_or(config::Filters { details: vec![] }),
                    sortings: payload
                        .sortings
                        .unwrap_or(config::Sorts { details: vec![] }),
                    groupings: payload
                        .groupings
                        .unwrap_or(config::Groupings { details: vec![] }),
                    views: payload.views.unwrap_or(config::Views { details: vec![] }),
                    limit: payload.limit,
                    offset: payload.offset,
                }),
                table: payload.table,
                variables: make_variable(&payload.variables.unwrap_or_default()),
                visualization_query_terms: QueryTerms::new(
                    match payload
                        .visualization
                        .unwrap_or(config::Visualization::default())
                        .query_terms
                    {
                        config::QueryTermDetails::QueryTermsUnderDetails { details: qt } => qt,
                        config::QueryTermDetails::QueryTerms(qt) => qt,
                    },
                ),
            },
        }
    }
}

pub fn make_variable(vars: &Vec<config::Variable>) -> Vec<Variable> {
    vars.iter()
        .map(|var| Variable {
            name: var.name.clone(),
            value: var.value.clone().unwrap_or(serde_json::Value::String(
                var.default.clone().unwrap_or_default(),
            )),
            var_type: var.var_type.clone().unwrap_or_default(),
        })
        .collect::<Vec<Variable>>()
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct QueryTerms {
    pub filters: Vec<Filter>,
    pub sortings: Vec<Sort>,
    pub groupings: Vec<Grouping>,
    pub views: Vec<View>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

impl QueryTerms {
    pub fn is_empty(&self) -> bool {
        self.filters.is_empty()
            && self.sortings.is_empty()
            && self.groupings.is_empty()
            && self.views.is_empty()
            && self.limit.is_none()
            && self.offset.is_none()
    }
    pub fn new(query_terms: config::QueryTerms) -> QueryTerms {
        Self {
            filters: make_filters(query_terms.filters.details),
            sortings: make_sorts(query_terms.sortings.details),
            groupings: make_groupings(query_terms.groupings.details),
            views: make_views(query_terms.views.details),
            limit: query_terms.limit,
            offset: query_terms.offset,
        }
    }
}
