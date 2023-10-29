use serde::{Deserialize, Serialize};

use crate::repository::models::ApiAction;

use super::super::results::query_terms::{filters, groups, sorts, views};

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QuestionConfig {
    #[serde(rename = "api_action")]
    pub api_action: Option<ApiAction>,
    pub database: Option<Database>,
    pub filters: Option<Filters>,
    pub groupings: Option<Groupings>,
    pub sortings: Option<Sorts>,
    pub table: Option<Table>,
    pub views: Option<Views>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
    pub query_type: Option<QueryType>,
    pub raw_query: Option<String>,
    pub variables: Option<Vec<Variable>>,
    pub visualization: Option<Visualization>,
}

#[derive(Serialize, Deserialize, Debug, Default)]
#[serde(rename_all = "camelCase")]
pub struct Visualization {
    pub id: Option<i64>,
    pub name: String,
    pub question_id: Option<i32>,
    pub query_terms: QueryTermDetails,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(untagged)]
pub enum QueryTermDetails {
    QueryTermsUnderDetails { details: QueryTerms },
    QueryTerms(QueryTerms),
}
impl Default for QueryTermDetails {
    fn default() -> Self {
        QueryTermDetails::QueryTerms(QueryTerms::default())
    }
}

// impl<'de> Deserialize<'de> for QueryTermDetails {
//     fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
//     where
//         D: Deserializer<'de>,
//     {
//         let json_value = serde_json::Value::deserialize(deserializer)?;
//
//         match json_value.clone() {
//             serde_json::Value::Object(obj) => {
//                 if let Some(details) = obj.get("details") {
//                     // Deserialize QueryTermsUnderDetails variant if "details" key exists
//                     let details = serde_json::from_value::<QueryTerms>(details.clone())
//                         .map_err(serde::de::Error::custom)?;
//
//                     Ok(QueryTermDetails::QueryTermsUnderDetails { details })
//                 } else {
//                     // Deserialize QueryTerms variant if "details" key is not present
//                     let query_terms = serde_json::from_value::<QueryTerms>(json_value)
//                         .map_err(serde::de::Error::custom)?;
//
//                     Ok(QueryTermDetails::QueryTerms(query_terms))
//                 }
//             }
//
//             _ => {
//                 // Deserialize QueryTerms variant if the input is not an object
//                 let query_terms = serde_json::from_value::<QueryTerms>(json_value)
//                     .map_err(serde::de::Error::custom)?;
//
//                 Ok(QueryTermDetails::QueryTerms(query_terms))
//             }
//         }
//     }
// }

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct QueryTerms {
    pub filters: Filters,
    pub groupings: Groupings,
    pub sortings: Sorts,
    pub views: Views,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Variable {
    pub name: String,
    pub value: serde_json::value::Value,
    pub var_type: VariableType,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum VariableType {
    String,
    Integer,
    Date,
}

#[derive(Serialize, Deserialize, Debug, Default)]
#[serde(rename_all = "snake_case")]
pub enum QueryType {
    #[default]
    QueryBuilder,
    Raw,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(untagged)]
pub enum StringOrInt32 {
    String(String),
    Int(i32),
}

impl Default for StringOrInt32 {
    fn default() -> Self {
        StringOrInt32::Int(0)
    }
}

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct Database {
    pub id: StringOrInt32,
    pub name: String,
    pub db_type: String,
    pub unique_identifier: Option<uuid::Uuid>,
}

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct Filters {
    pub details: Vec<Filter>,
}

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct Groupings {
    pub details: Vec<Grouping>,
}

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct Sorts {
    pub details: Vec<Sort>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Table {
    pub database: Option<StringOrInt32>,
    pub id: Option<StringOrInt32>,
    pub name: Option<String>,
    pub readable_table_name: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct Views {
    pub details: Vec<View>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Filter {
    pub column: Option<String>,
    pub is_value_datetime: bool,
    pub operator: Option<filters::FilterOperator>,
    pub raw: bool,
    pub value: Option<serde_json::value::Value>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Grouping {
    pub column: Option<String>,
    pub duration: Option<groups::GroupDuration>,
    pub raw: bool,
    pub value: Option<serde_json::value::Value>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct View {
    pub agg: Option<views::ViewAggregations>,
    pub column: Option<String>,
    pub columns: Vec<String>,
    pub is_aggregation: bool,
    pub raw: bool,
    pub value: Option<serde_json::value::Value>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Sort {
    pub column: Option<String>,
    pub direction: Option<sorts::SortDirection>,
    pub raw: bool,
    pub value: Option<serde_json::value::Value>,
}
