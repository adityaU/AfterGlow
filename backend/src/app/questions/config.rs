use serde::{Deserialize, Serialize};

use crate::repository::models::{ApiActionChangeset, RendererTypes, VariableType};

use super::super::results::query_terms::{filters, groups, sorts, views};

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct QuestionHumanSql {
    #[serde(rename = "api_action")]
    pub api_action: Option<ApiActionChangeset>,
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

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Visualization {
    pub id: Option<i64>,
    pub name: String,
    pub question_id: Option<i64>,
    pub query_terms: QueryTermDetails,
    pub settings: Option<serde_json::value::Value>,
    pub renderer_type: Option<RendererTypes>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
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

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct QueryTerms {
    pub filters: Filters,
    pub groupings: Groupings,
    pub sortings: Sorts,
    pub views: Views,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Variable {
    pub name: String,
    pub value: Option<serde_json::value::Value>,
    pub var_type: Option<VariableType>,
    pub default: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
#[serde(rename_all = "snake_case")]
pub enum QueryType {
    #[default]
    QueryBuilder,
    Raw,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(untagged)]
pub enum StringOrInt64 {
    String(String),
    Int(i64),
}

impl Default for StringOrInt64 {
    fn default() -> Self {
        StringOrInt64::Int(0)
    }
}

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct Database {
    pub id: StringOrInt64,
    pub name: String,
    pub db_type: String,
    pub unique_identifier: Option<uuid::Uuid>,
}

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct Filters {
    pub details: Vec<Filter>,
}

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct Groupings {
    pub details: Vec<Grouping>,
}

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct Sorts {
    pub details: Vec<Sort>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Table {
    pub database: Option<StringOrInt64>,
    pub id: Option<StringOrInt64>,
    pub name: Option<String>,
    pub readable_table_name: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct Views {
    pub details: Vec<View>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Filter {
    pub column: Option<String>,
    pub is_value_datetime: bool,
    pub operator: Option<filters::FilterOperator>,
    pub raw: bool,
    pub value: Option<serde_json::value::Value>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Grouping {
    pub column: Option<String>,
    pub duration: Option<groups::GroupDuration>,
    pub raw: bool,
    pub value: Option<serde_json::value::Value>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct View {
    pub agg: Option<views::ViewAggregations>,
    pub column: Option<String>,
    pub columns: Vec<String>,
    pub is_aggregation: bool,
    pub raw: bool,
    pub value: Option<serde_json::value::Value>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Sort {
    pub column: Option<String>,
    pub direction: Option<sorts::SortDirection>,
    pub raw: bool,
    pub value: Option<serde_json::value::Value>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct QuestionConfig {
    pub can_viewers_change_query_terms: bool,
    pub can_viewers_see_in_new_visualization: bool,
}
