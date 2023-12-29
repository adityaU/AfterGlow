use serde::{Deserialize, Deserializer, Serialize, Serializer};

use crate::app::questions::config;

#[derive(Debug, PartialEq, Clone)]
pub enum GroupDuration {
    AsItIs,
    BySeconds,
    ByMinute,
    ByDay,
    ByHour,
    ByWeek,
    ByMonth,
    ByQuarter,
    ByYear,
    ByHourOfTheDay,
    ByDayOfTheWeek,
    ByWeekOfYear,
    ByMonthOfYear,
    ByDayOfTheMonth,
    ByQuarterOfYear,
    Invalid,
}
impl Serialize for GroupDuration {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        use GroupDuration::*;

        let value = match self {
            AsItIs => "As It is",
            BySeconds => "by Seconds",
            ByMinute => "by Minute",
            ByDay => "by Day",
            ByHour => "by Hour",
            ByWeek => "by Week",
            ByMonth => "by Month",
            ByQuarter => "by Quarter",
            ByYear => "by year",
            ByHourOfTheDay => "by Hour of the day",
            ByDayOfTheWeek => "by Day of the week",
            ByWeekOfYear => "by week of year",
            ByDayOfTheMonth => "by day of the month",
            ByMonthOfYear => "by month of year",
            ByQuarterOfYear => "by quarter of year",
            Invalid => "invalid",
            // ... match other variants
            _ => unimplemented!(), // Add other matches before this line
        };
        serializer.serialize_str(value)
    }
}

impl<'de> Deserialize<'de> for GroupDuration {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let value = String::deserialize(deserializer)?;
        use GroupDuration::*;
        match value.as_str() {
            "As It is" => Ok(AsItIs),
            "by Seconds" => Ok(BySeconds),
            "by Minute" => Ok(ByMinute),
            "by Day" => Ok(ByDay),
            "by Hour" => Ok(ByHour),
            "by Week" => Ok(ByWeek),
            "by Month" => Ok(ByMonth),
            "by Quarter" => Ok(ByQuarter),
            "by year" => Ok(ByYear),
            "by Hour of the day" => Ok(ByHourOfTheDay),
            "by Day of the week" => Ok(ByDayOfTheWeek),
            "by week of year" => Ok(ByWeekOfYear),
            "by day of the month" => Ok(ByDayOfTheMonth),
            "by month of year" => Ok(ByMonthOfYear),
            "by quarter of year" => Ok(ByQuarterOfYear),
            _ => Ok(Invalid),
        }
    }
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub enum Grouping {
    Raw {
        value: String,
    },
    QBDatetime {
        column: String,
        duration: GroupDuration,
    },
    QB {
        column: String,
    },
    Invalid,
}

pub fn make_groupings(groupings: Vec<config::Grouping>) -> Vec<Grouping> {
    groupings
        .into_iter()
        .map(|grouping| match grouping.raw {
            true => {
                let value = if let Some(v) = grouping.value {
                    if let serde_json::value::Value::String(s) = v {
                        s
                    } else {
                        return Grouping::Invalid;
                    }
                } else {
                    return Grouping::Invalid;
                };
                Grouping::Raw { value }
            }
            false => {
                let column = if let Some(v) = grouping.column {
                    v
                } else {
                    return Grouping::Invalid;
                };

                if let Some(duration) = grouping.duration {
                    Grouping::QBDatetime { column, duration }
                } else {
                    Grouping::QB { column }
                }
            }
        })
        .filter(|f| match f {
            Grouping::Invalid => false,
            _ => true,
        })
        .collect()
}
