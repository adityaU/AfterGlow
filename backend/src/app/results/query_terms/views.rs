use serde::{Deserialize, Deserializer, Serialize, Serializer};

use crate::app::questions::config;

#[derive(Deserialize, Serialize, Debug, Clone)]
pub enum View {
    Raw {
        value: String,
    },
    Aggregate {
        agg: ViewAggregations,
        column: String,
        value: Option<f64>,
    },
    QB {
        columns: Vec<Column>,
    },
    Invalid,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub enum Column {
    Column(String),
    AllColumns,
}

#[derive(Debug, PartialEq, Clone)]
pub enum ViewAggregations {
    CountOfRows,
    MinimumOf,
    MaximumOf,
    SumOf,
    AverageOf,
    PercentileOf,
    StandardDeviation,
    StandardVariance,
    Invalid,
}

impl Serialize for ViewAggregations {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        use ViewAggregations::*;

        let value = match self {
            CountOfRows => "count of rows",
            MinimumOf => "minimum of",
            MaximumOf => "maximum of",
            SumOf => "sum of",
            AverageOf => "average of",
            PercentileOf => "percentile of",
            StandardDeviation => "standard deviation",
            StandardVariance => "standard variance",
            Invalid => "invalid",
            _ => "invalid", // Add other matches before this line
        };
        serializer.serialize_str(value)
    }
}

impl<'de> Deserialize<'de> for ViewAggregations {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let value = String::deserialize(deserializer)?;
        use ViewAggregations::*;
        match value.as_str() {
            "count of rows" => Ok(CountOfRows),
            "minimum of" => Ok(MinimumOf),
            "maximum of" => Ok(MaximumOf),
            "sum of" => Ok(SumOf),
            "average of" => Ok(AverageOf),
            "percentile of" => Ok(PercentileOf),
            "standard deviation" => Ok(StandardDeviation),
            "standard variance" => Ok(StandardVariance),
            _ => Ok(Invalid),
        }
    }
}
pub fn make_views(views: Vec<config::View>) -> Vec<View> {
    views
        .into_iter()
        .map(|view| match view.raw {
            true => {
                let value = if let Some(v) = view.value {
                    if let serde_json::value::Value::String(s) = v {
                        s
                    } else {
                        return View::Invalid;
                    }
                } else {
                    return View::Invalid;
                };
                View::Raw { value }
            }
            false => match view.is_aggregation {
                true => {
                    let agg = match view.agg {
                        Some(v) => match v != ViewAggregations::Invalid {
                            true => v,
                            false => return View::Invalid,
                        },
                        _ => return View::Invalid,
                    };
                    let column = match view.column {
                        Some(v) => v,
                        _ => return View::Invalid,
                    };

                    let value = match agg {
                        ViewAggregations::PercentileOf => match view.value {
                            Some(serde_json::value::Value::Number(s)) if s.as_f64().is_some() => {
                                s.as_f64()
                            }
                            _ => return View::Invalid,
                        },
                        _ => None,
                    };

                    View::Aggregate { agg, column, value }
                }
                false => View::QB {
                    columns: view
                        .columns
                        .iter()
                        .map(|c| match c.to_lowercase().as_str() {
                            "all columns" => Column::AllColumns,
                            v => Column::Column(v.to_string()),
                        })
                        .collect(),
                },
            },
        })
        .filter(|f| match f {
            View::Invalid => false,
            _ => true,
        })
        .collect()
}
