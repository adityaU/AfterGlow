use serde::{Deserialize, Serialize};

use crate::{app::questions::config};

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "lowercase")]
pub enum SortDirection {
    Ascending,
    Descending,
}

#[derive(Deserialize, Serialize, Debug)]
pub enum Sort {
    Raw {
        value: String,
    },
    QB {
        column: String,
        direction: SortDirection,
    },
    Invalid,
}
pub fn make_sorts(sorts: Vec<config::Sort>) -> Vec<Sort> {
    sorts
        .into_iter()
        .map(|sort| match sort.raw {
            true => {
                let value = if let Some(v) = sort.value {
                    if let serde_json::value::Value::String(s) = v {
                        s
                    } else {
                        return Sort::Invalid;
                    }
                } else {
                    return Sort::Invalid;
                };

                Sort::Raw { value }
            }
            false => {
                let column = if let Some(v) = sort.column {
                    v
                } else {
                    return Sort::Invalid;
                };

                let direction = if let Some(v) = sort.direction {
                    v
                } else {
                    return Sort::Invalid;
                };
                Sort::QB { column, direction }
            }
        })
        .filter(|f| match f {
            Sort::Invalid => false,
            _ => true,
        })
        .collect()
}
