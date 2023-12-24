use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RendererConfig {
    pub area: Option<Chart>,
    pub bar: Option<Chart>,
    pub bubble: Option<Chart>,
    pub custom_list: Option<Value>,
    pub funnel: Option<Chart>,
    pub line: Option<Chart>,
    pub number: Option<Number>,
    pub pie: Option<Chart>,
    pub table: Option<Table>,
    #[serde(rename = "transposed_table")]
    pub transposed_table: Option<Table>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Chart {
    pub series: Vec<Series>,
    pub x_title: Option<String>,
    pub xaxis: Option<String>,
    pub y_title: Option<String>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Number {
    pub data_column: Option<String>,
    pub data_format: Option<String>,
    pub data_prefix: Option<String>,
    pub data_suffix: Option<String>,
    pub subtitle_column: Option<String>,
    pub trend_column: Option<String>,
    pub trend_format: Option<String>,
    pub trend_prefix: Option<String>,
    pub trend_suffix: Option<String>,
    pub title: Option<String>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Series {
    pub chart_type: String,
    pub color: String,
    pub data_column: String,
    pub dimension: Dimension,
    pub is_stacked: bool,
    pub show: bool,
    pub show_label: bool,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Dimension {
    pub data_column: String,
    pub name: Value,
    pub options: Vec<DimOption>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DimOption {
    pub chart_type: String,
    pub color: Option<String>,
    pub legend_name: Value,
    pub name: Value,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Table {
    pub columns: Vec<Column>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Column {
    pub name: String,
    pub new_order: i64,
    pub order: i64,
    pub show: bool,
}
