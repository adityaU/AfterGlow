use std::fmt;

use diesel::PgConnection;
use fancy_regex::Regex;
use lazy_static::lazy_static;
use serde::Deserialize;
use serde::Serialize;

use crate::repository::models::Column;

use crate::repository::models::Team;
use crate::repository::models::User;

lazy_static! {
    static ref TABLE_REGEX: Regex = Regex::new(r"(?<matched>(from|join)\s+(?<table>\S+)\W*((as){0,1}\W*)(?<alias>(?!(left|right|outer|inner|join|where|group|having|window|union|all|except|distinct|order|limit|offset|fetch|for|with|roleup|grouping|intersect|cube))\S+){0,1})").unwrap();
}
#[derive(Debug, Default)]
pub struct TableOption {
    pub table: String,
    pub alias: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SuggestionTypes {
    Table,
    Column,
    Function,
    Keyword,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Suggestions {
    meta: SuggestionTypes,
    name: String,
    score: f64,
    value: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum AutoCompleteError {
    UnableToFindTable(String),
}

impl fmt::Display for AutoCompleteError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AutoCompleteError::UnableToFindTable(msg) => write!(f, "Unable to find table: {}", msg),
        }
    }
}

impl std::error::Error for AutoCompleteError {}

pub fn complete(
    conn: &mut PgConnection,
    sql: &str,
    prefix: &str,
    database_id: i64,
) -> Result<Vec<Suggestions>, AutoCompleteError> {
    let mut table_options = vec![];
    for capture in TABLE_REGEX.captures_iter(sql).filter_map(Result::ok) {
        let table = capture.name("table").map_or("", |m| m.as_str());
        let alias = capture.name("alias").map_or("", |m| m.as_str());
        let table_option = TableOption {
            table: table.to_string(),
            alias: alias.to_string(),
        };
        table_options.push(table_option)
    }

    if table_options.len() == 0 {
        return Ok(vec![]);
    }

    for table_option in table_options.iter() {
        if table_option.alias.starts_with(prefix) {
            return make_suggestions(conn, table_option, database_id, table_option.alias.clone());
        }
        if table_option.table.starts_with(prefix) {
            return make_suggestions(conn, table_option, database_id, table_option.table.clone());
        }
    }

    Ok(vec![])
}

fn make_suggestions(
    conn: &mut PgConnection,
    table_option: &TableOption,
    database_id: i64,
    alias: String,
) -> Result<Vec<Suggestions>, AutoCompleteError> {
    let columns =
        Column::find_by_tablename_and_database_id(conn, table_option.table.clone(), database_id)
            .map_err(|err| AutoCompleteError::UnableToFindTable(err.to_string()))?;
    Ok(columns
        .iter()
        .map(|item| Suggestions {
            meta: SuggestionTypes::Column,
            name: format!("{}.{}", alias, item.name.clone().unwrap_or_default()),
            score: 100.0 / item.name.clone().unwrap_or_default().len() as f64,
            value: format!("{}.{}", alias, item.name.clone().unwrap_or_default()),
        })
        .collect())
}

pub fn recipients(conn: &mut PgConnection, query: String) -> Vec<String> {
    let mut users = match User::search(conn, query.clone()) {
        Ok(users) => users
            .iter()
            .map(|u| u.email.clone())
            .filter(|u| u.is_some())
            .map(|u| u.unwrap())
            .collect(),
        Err(_) => vec![],
    };

    let mut teams = match Team::search(conn, query) {
        Ok(teams) => teams
            .iter()
            .map(|t| format!(r#""{}"@team"#, t.name.clone()))
            .collect(),
        Err(_) => vec![],
    };

    teams.append(&mut users);
    teams
}
