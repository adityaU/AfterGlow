use serde::{Deserialize, Deserializer, Serialize, Serializer};

use crate::{app::questions::config};

#[derive(Deserialize, Serialize, Debug)]
pub enum Filter {
    Raw {
        value: String,
    },
    QB {
        column: String,
        operator: FilterOperator,
        value: Option<serde_json::value::Value>,
    },
    QBDatetime {
        column: String,
        operator: FilterOperator,
        value: DateObject,
    },
    Invalid,
}

#[derive(Deserialize, Serialize, Debug)]
pub enum DateObject {
    DatePicker(String),
    DurationPicker {
        duration_value: i32,
        duration_type: DurationType,
        duration_tense: DurationTenseType,
    },
}

#[derive(Deserialize, Serialize, Debug)]
pub enum DurationType {
    Seconds,
    Minutes,
    Hours,
    Days,
    Weeks,
    Months,
    Quarters,
    Years,
}

#[derive(Deserialize, Serialize, Debug)]
pub enum DurationTenseType {
    Ago,
    Later,
}

#[derive(Debug, PartialEq, Clone)]
pub enum FilterOperator {
    Equal,
    NotEqual,
    GreaterThan,
    LessThan,
    GreaterThanOrEqual,
    LessThanOrEqual,
    In,
    NotIn,
    IsNull,
    IsNotNull,
    Matches,
    StartsWith,
    EndsWith,
    Invalid,
}

impl Serialize for FilterOperator {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        use FilterOperator::*;

        let value = match self {
            Equal => "=",
            NotEqual => "!=",
            GreaterThan => ">",
            LessThan => "<",
            GreaterThanOrEqual => ">=",
            LessThanOrEqual => "<=",
            In => "in",
            NotIn => "not in",
            IsNull => "is NULL",
            IsNotNull => "is not NULL",
            Matches => "matches",
            StartsWith => "starts with",
            EndsWith => "ends with",
            Invalid => "invalid",
            // ... match other variants
            _ => unimplemented!(), // Add other matches before this line
        };
        serializer.serialize_str(value)
    }
}

impl<'de> Deserialize<'de> for FilterOperator {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let value = String::deserialize(deserializer)?;
        use FilterOperator::*;
        match value.as_str() {
            "=" => Ok(Equal),
            "!=" => Ok(NotEqual),
            ">" => Ok(GreaterThan),
            "<" => Ok(LessThan),
            ">=" => Ok(GreaterThanOrEqual),
            "<=" => Ok(LessThanOrEqual),
            "in" => Ok(In),
            "not in" => Ok(NotIn),
            "is NULL" => Ok(IsNull),
            "is not NULL" => Ok(IsNotNull),
            "matches" => Ok(Matches),
            "starts with" => Ok(StartsWith),
            "ends with" => Ok(EndsWith),
            _ => Ok(Invalid),
        }
    }
}

pub fn make_filters(filters: Vec<config::Filter>) -> Vec<Filter> {
    filters
        .into_iter()
        .map(|filter| match filter.raw {
            true => {
                let value = if let Some(v) = filter.value {
                    if let serde_json::value::Value::String(s) = v {
                        s
                    } else {
                        return Filter::Invalid;
                    }
                } else {
                    return Filter::Invalid;
                };

                Filter::Raw { value }
            }
            false => {
                let column = if let Some(v) = filter.column {
                    v
                } else {
                    return Filter::Invalid;
                };
                let operator = if let Some(v) = filter.operator {
                    v
                } else {
                    return Filter::Invalid;
                };
                let value = if (FilterOperator::IsNull != operator)
                    && (FilterOperator::IsNotNull != operator)
                {
                    if let Some(v) = filter.value {
                        Some(v)
                    } else {
                        return Filter::Invalid;
                    }
                } else {
                    None
                };

                match filter.is_value_datetime {
                    true => {
                        let val = match value {
                            Some(v) => {
                                let value: Result<DateObject, _> = serde_json::from_value(v);
                                match value {
                                    Ok(t) => t,
                                    Err(_) => return Filter::Invalid,
                                }
                            }
                            None => return Filter::Invalid,
                        };
                        Filter::QBDatetime {
                            column,
                            operator,
                            value: val,
                        }
                    }
                    false => Filter::QB {
                        column,
                        operator,
                        value,
                    },
                }
            }
        })
        .filter(|f| match f {
            Filter::Invalid => false,
            _ => true,
        })
        .collect()
}
