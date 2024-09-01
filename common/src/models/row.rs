use chrono::{NaiveDate, NaiveDateTime, NaiveTime};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Default)]
#[serde(untagged)]
pub enum RowElement {
    Text(String),
    Number(IntOrFloat),
    Boolean(bool),
    Date(NaiveDate),
    Time(NaiveTime),
    DateTime(NaiveDateTime),
    ArrayString(Vec<String>),
    ArrayNumber(Vec<IntOrFloat>),
    #[default]
    None,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(untagged)]
pub enum IntOrFloat {
    Int(i64),
    Float(f64),
}

impl IntOrFloat {
    pub fn to_sql_value(&self) -> String {
        use IntOrFloat::*;
        match self {
            Int(value) => format!("{}", value),
            Float(value) => format!("{}", value),
        }
    }
    pub fn to_string(&self) -> String {
        use IntOrFloat::*;
        match self {
            Int(value) => value.to_string(),
            Float(value) => value.to_string(),
        }
    }
}

//implement the Display trait for RowElement
impl RowElement {
    pub fn to_sql_value(&self) -> String {
        use RowElement::*;
        match self {
            Text(value) => format!("'{}'", value),
            Number(value) => value.to_sql_value(),
            Boolean(value) => format!("{}", value),
            Date(value) => format!("'{}'", value),
            Time(value) => format!("'{}'", value),
            DateTime(value) => format!("'{}'", value),
            ArrayString(value) => format!("{:?}", value),
            ArrayNumber(value) => format!("{:?}", value),
            None => "null".to_string(),
        }
    }

    pub fn to_string(&self) -> String {
        use RowElement::*;
        match self {
            Text(value) => value.to_string(),
            Number(value) => value.to_string(),
            Boolean(value) => value.to_string(),
            Date(value) => value.to_string(),
            Time(value) => value.to_string(),
            DateTime(value) => value.to_string(),
            ArrayString(value) => format!("{:?}", value),
            ArrayNumber(value) => format!("{:?}", value),
            None => "null".to_string(),
        }
    }
}
