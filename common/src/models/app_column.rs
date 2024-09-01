use chrono::Local;
use chrono::NaiveDate;
use chrono::NaiveDateTime;
use chrono::ParseError;
use chrono::Utc;
use crud_derive::{Changeset, View};
use diesel::deserialize::Queryable;
use diesel::deserialize::{self, FromSql, FromSqlRow};
use diesel::expression::AsExpression;
use diesel::pg::{Pg, PgValue};
use diesel::result::Error;
use diesel::serialize::{self, IsNull, Output, ToSql};
use diesel::sql_types::Jsonb;
use diesel::AsChangeset;
use diesel::ExpressionMethods;
use diesel::Insertable;
use diesel::PgConnection;
use diesel::QueryDsl;
use diesel::RunQueryDsl;
use num_format::{Locale, ToFormattedString};
use serde::{Deserialize, Serialize};
use std::fmt;
use std::io::Write;
use std::num::ParseIntError;

use super::row::IntOrFloat;
use super::row::RowElement;
use super::schema::app_columns;

#[derive(Debug, Clone, PartialEq, Serialize, Eq, Hash, Deserialize)]
#[serde(untagged)]
pub enum VecOrSingle<T> {
    Vec(Vec<T>),
    Single(T),
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, Default)]
#[serde(untagged)]
pub enum NumberFormats {
    US, // 1,234,567.89
    DE, // 1.234.567,89
    FR, // 1 234 567,89
    IN, // 12,34,567.89
    #[default]
    NoSeperator, //1234567.89
}
impl NumberFormats {
    pub fn locale(&self) -> Locale {
        match self {
            NumberFormats::US => Locale::en,
            NumberFormats::DE => Locale::de,
            NumberFormats::FR => Locale::fr,
            NumberFormats::IN => Locale::en_IN,
            NumberFormats::NoSeperator => Locale::en,
        }
    }
    fn format_example(&self) -> &'static str {
        match self {
            NumberFormats::US => "1,234,567.89",
            NumberFormats::DE => "1.234.567,89",
            NumberFormats::FR => "1 234 567,89",
            NumberFormats::IN => "12,34,567.89",
            NumberFormats::NoSeperator => "1234567.89",
        }
    }

    pub fn decimal_seperator(&self) -> char {
        match self {
            NumberFormats::DE | NumberFormats::FR => ',',
            _ => '.',
        }
    }

    pub fn label(&self) -> String {
        format!("{:?} ({})", self, self.format_example())
    }

    pub fn format_number(&self, number: f64, is_integer: bool) -> String {
        let formatted = format!("{:.2}", number); // Adjust precision as needed

        // Use num_format to format the integer part
        let parts: Vec<&str> = formatted.split('.').collect();
        let integer_part = parts[0].parse::<i64>().unwrap_or(0);

        if is_integer {
            return integer_part.to_formatted_string(&self.locale());
        }
        let formatted_integer = integer_part.to_formatted_string(&self.locale());

        // Combine the formatted integer part with the decimal part
        if parts.len() > 1 {
            format!(
                "{}{}{}",
                formatted_integer,
                &self.decimal_seperator(),
                parts[1]
            )
        } else {
            formatted_integer
        }
    }
}

impl fmt::Display for NumberFormats {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, Default)]
#[serde(untagged)]
pub enum DateFormat {
    #[default]
    ISO8601, // 2023-08-07
    RFC2822,          // 07 Aug 2023
    US,               // 08/07/2023
    UK,               // 07/08/2023
    DE,               // 07.08.2023
    MonthDayYear,     // August 07, 2023
    MonthAbbrDayYear, // Aug 07, 2023
    DayMonthYear,     // 07 August 2023
    DayMonthAbbrYear, // 07 Aug 2023
}
impl DateFormat {
    pub fn format(&self) -> &str {
        match self {
            DateFormat::ISO8601 => "%Y-%m-%d",
            DateFormat::RFC2822 => "%d %b %Y",
            DateFormat::US => "%m/%d/%Y",
            DateFormat::UK => "%d/%m/%Y",
            DateFormat::DE => "%d.%m.%Y",
            DateFormat::MonthDayYear => "%B %d, %Y",
            DateFormat::MonthAbbrDayYear => "%b %d, %Y",
            DateFormat::DayMonthYear => "%d %B %Y",
            DateFormat::DayMonthAbbrYear => "%d %b %Y",
        }
    }

    pub fn parse_date(&self, date_str: &str) -> Result<NaiveDate, ParseError> {
        NaiveDate::parse_from_str(date_str, self.format())
    }

    pub fn format_date(&self, date: &NaiveDate) -> String {
        date.format(self.format()).to_string()
    }
    pub fn label(&self) -> String {
        // Get the current date from the system
        let current_date = Local::now().naive_local().date();

        // Format the current date according to the specific format
        self.format_date(&current_date)
    }
}
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, Default)]
#[serde(untagged)]
pub enum DateTimeFormat {
    #[default]
    ISO8601, // 2023-08-07T15:07:08Z
    ISO8601AMPM,              // 2023-08-07T03:07:08 PM
    US,                       // 08/07/2023 03:07:08 PM
    UK,                       // 07/08/2023 15:07:08
    UKAMPM,                   // 07/08/2023 03:07:08 PM
    DE,                       // 07.08.2023 15:07:08
    DEAMPM,                   // 07.08.2023 03:07:08 PM
    MonthDayYearTime,         // August 07, 2023 15:07:08
    MonthDayYearTimeAMPM,     // August 07, 2023 03:07:08 PM
    MonthAbbrDayYearTime,     // Aug 07, 2023 15:07:08
    MonthAbbrDayYearTimeAMPM, // Aug 07, 2023 03:07:08 PM
    DayMonthYearTime,         // 07 August 2023 15:07:08
    DayMonthYearTimeAMPM,     // 07 August 2023 03:07:08 PM
    DayMonthAbbrYearTime,     // 07 Aug 2023 15:07:08
    DayMonthAbbrYearTimeAMPM, // 07 Aug 2023 03:07:08 PM
}

impl DateTimeFormat {
    pub fn format(&self) -> &str {
        match self {
            DateTimeFormat::ISO8601 => "%Y-%m-%dT%H:%M:%S%.fZ",
            DateTimeFormat::ISO8601AMPM => "%Y-%m-%dT%I:%M:%S %.f %p",
            DateTimeFormat::US => "%m/%d/%Y %I:%M:%S %p",
            DateTimeFormat::UK => "%d/%m/%Y %H:%M:%S",
            DateTimeFormat::UKAMPM => "%d/%m/%Y %I:%M:%S %p",
            DateTimeFormat::DE => "%d.%m.%Y %H:%M:%S",
            DateTimeFormat::DEAMPM => "%d.%m.%Y %I:%M:%S %p",
            DateTimeFormat::MonthDayYearTime => "%B %d, %Y %H:%M:%S",
            DateTimeFormat::MonthDayYearTimeAMPM => "%B %d, %Y %I:%M:%S %p",
            DateTimeFormat::MonthAbbrDayYearTime => "%b %d, %Y %H:%M:%S",
            DateTimeFormat::MonthAbbrDayYearTimeAMPM => "%b %d, %Y %I:%M:%S %p",
            DateTimeFormat::DayMonthYearTime => "%d %B %Y %H:%M:%S",
            DateTimeFormat::DayMonthYearTimeAMPM => "%d %B %Y %I:%M:%S %p",
            DateTimeFormat::DayMonthAbbrYearTime => "%d %b %Y %H:%M:%S",
            DateTimeFormat::DayMonthAbbrYearTimeAMPM => "%d %b %Y %I:%M:%S %p",
        }
    }

    pub fn parse_datetime(&self, datetime_str: &str) -> Result<NaiveDateTime, ParseError> {
        NaiveDateTime::parse_from_str(datetime_str, self.format())
    }

    pub fn format_datetime(&self, datetime: &NaiveDateTime) -> String {
        datetime.format(self.format()).to_string()
    }

    pub fn label(&self) -> String {
        // Get the current date from the system
        let current_date = Utc::now().naive_utc();

        // Format the current date according to the specific format
        self.format_datetime(&current_date)
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub struct DefaultNumber {
    pub is_negetive: bool,
    pub after_decimal: Option<u64>,
    pub before_decimal: u64,
}
impl fmt::Display for DefaultNumber {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        // Start with the negative sign if the number is negative
        if self.is_negetive {
            write!(f, "-")?;
        }

        // Write the part before the decimal point
        write!(f, "{}", self.before_decimal)?;

        // Write the decimal point and the part after the decimal point, if present
        if let Some(after_decimal) = self.after_decimal {
            write!(f, ".{}", after_decimal)?;
        }

        Ok(())
    }
}
#[derive(Debug)]
pub enum ParseDefaultNumberError {
    EmptyInput,
    InvalidFormat,
    ParseIntError(ParseIntError),
}

impl From<ParseIntError> for ParseDefaultNumberError {
    fn from(err: ParseIntError) -> Self {
        ParseDefaultNumberError::ParseIntError(err)
    }
}

impl TryFrom<String> for DefaultNumber {
    type Error = ParseDefaultNumberError;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        if value.trim().is_empty() {
            return Err(ParseDefaultNumberError::EmptyInput);
        }

        let mut is_negetive = false;
        let input = value.trim();

        // Check if the number is negative
        let number_str = if input.starts_with('-') {
            is_negetive = true;
            &input[1..]
        } else {
            input
        };

        // Split the string into parts before and after the decimal point
        let parts: Vec<&str> = number_str.split('.').collect();

        // Handle the part before the decimal point
        let before_decimal = match parts.get(0) {
            Some(&part) if !part.is_empty() => part.parse::<u64>()?,
            _ => return Err(ParseDefaultNumberError::InvalidFormat),
        };

        // Handle the part after the decimal point
        let after_decimal = if parts.len() > 1 {
            match parts.get(1) {
                Some(&part) if !part.is_empty() => Some(part.parse::<u64>()?),
                Some(&part) if part.is_empty() => None, // Handle the case of a trailing dot
                _ => return Err(ParseDefaultNumberError::InvalidFormat),
            }
        } else {
            None
        };

        Ok(DefaultNumber {
            is_negetive,
            before_decimal,
            after_decimal,
        })
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, Default)]
#[serde(untagged)]
pub enum AbbrievationFormat {
    #[default]
    None,
    Billion,
    Million,
    Thousand,
}

impl AbbrievationFormat {
    pub fn label(&self) -> String {
        match self {
            AbbrievationFormat::None => "As it is (1000000)".to_string(),
            AbbrievationFormat::Billion => "Billion (1.1B)".to_string(),
            AbbrievationFormat::Million => "Million (1.1M)".to_string(),
            AbbrievationFormat::Thousand => "Thousand (1.1K)".to_string(),
        }
    }
}
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, Default)]
#[serde(untagged)]
pub enum PercentDisplayOptions {
    #[default]
    None,
    Bar,
    Circle,
}

impl PercentDisplayOptions {
    pub fn label(&self) -> String {
        match self {
            PercentDisplayOptions::None => "Number Only".to_string(),
            PercentDisplayOptions::Bar => "Bar".to_string(),
            PercentDisplayOptions::Circle => "Circle".to_string(),
        }
    }
}
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, Default)]
#[serde(untagged)]
pub enum CheckboxStyle {
    Tick,
    Circle,
    Heart,
    #[default]
    Toggle,
}

impl CheckboxStyle {
    pub fn label(&self) -> String {
        match self {
            CheckboxStyle::Tick => " Tick".to_string(),
            CheckboxStyle::Circle => "Circle".to_string(),
            CheckboxStyle::Heart => "Heart".to_string(),
            CheckboxStyle::Toggle => "Toggle".to_string(),
        }
    }
}
#[derive(Debug, PartialEq, FromSqlRow, AsExpression, Eq, Serialize, Deserialize, Clone)]
#[sql_type = "Jsonb"]
#[serde(rename_all = "snake_case")]
pub enum TypeValidation {
    Number {
        is_integer: bool,
        precision: Option<u8>,
        format: NumberFormats,
        default: Option<String>,
        allow_negetive: bool,
    },
    Text {
        max_length: Option<u64>,
        min_length: Option<u64>,
        enable_rich_formatting: bool,
        default: Option<String>,
    },
    Date {
        default_to_current: bool,
        format: DateFormat,
    },
    DateTime {
        default_to_current: bool,
        format: DateTimeFormat,
    },
    Email {
        default: Option<String>,
    },
    Url {
        default: Option<String>,
    },
    Attachment {
        default: Option<String>,
        max_size: Option<u64>,
        possible_extensions: Vec<String>,
    },
    MultipleSelect {
        options: Vec<String>,
        default: Option<Vec<String>>,
    },
    SingleSelect {
        default: Option<String>,
        options: Vec<String>,
    },
    PhoneNumber {
        default: Option<String>,
    },
    Currency {
        symbol: Option<String>,
        default: Option<String>,
        format: NumberFormats,
        allow_negetive: bool,
        decimal_places: u32,
        abbreviation: AbbrievationFormat,
    },
    Percentage {
        default: Option<String>,
        decimal_places: u32,
        format: NumberFormats,
        allow_negetive: bool,
        display_as: PercentDisplayOptions,
    },
    CreatedBy {},
    LastModifiedBy {},
    AutoNumber {},
    Formula {
        formula: String,
        format: Box<TypeValidation>,
    },
    Checkbox {
        style: CheckboxStyle,
        default: bool,
    },
    User {
        allow_multiple: bool,
        default: Option<VecOrSingle<i64>>,
    },
    CreatedAt {
        format: DateTimeFormat,
    },
    UpdatedAt {
        format: DateTimeFormat,
    },
    Rating {
        max: i32,
        default: Option<i32>,
        allowed_decimal: bool,
        decimal_places: u32,
    },
    ProgressBar {
        max: i32,
        default: Option<i32>,
        allowed_decimal: bool,
        decimal_places: u32,
    },
}

impl Default for TypeValidation {
    fn default() -> Self {
        TypeValidation::Text {
            max_length: None,
            min_length: None,
            enable_rich_formatting: false,
            default: None,
        }
    }
}

impl TypeValidation {
    pub fn get_type(&self) -> String {
        match &self {
            TypeValidation::Number { .. } => "number".to_string(),
            TypeValidation::Text { .. } => "text".to_string(),
            TypeValidation::Date { .. } => "date".to_string(),
            TypeValidation::DateTime { .. } => "datetime".to_string(),
            TypeValidation::Email { .. } => "email".to_string(),
            TypeValidation::Url { .. } => "url".to_string(),
            TypeValidation::Attachment { .. } => "attachment".to_string(),
            TypeValidation::MultipleSelect { .. } => "multiple_select".to_string(),
            TypeValidation::SingleSelect { .. } => "single_select".to_string(),
            TypeValidation::PhoneNumber { .. } => "phone_number".to_string(),
            TypeValidation::Currency { .. } => "currency".to_string(),
            TypeValidation::Percentage { .. } => "percentage".to_string(),
            TypeValidation::CreatedBy {} => "created_by".to_string(),
            TypeValidation::LastModifiedBy {} => "last_modified_by".to_string(),
            TypeValidation::AutoNumber {} => "auto_number".to_string(),
            TypeValidation::Formula { .. } => "formula".to_string(),
            TypeValidation::Checkbox { .. } => "checkbox".to_string(),
            TypeValidation::User { .. } => "user".to_string(),
            TypeValidation::CreatedAt { .. } => "created_at".to_string(),
            TypeValidation::UpdatedAt { .. } => "updated_at".to_string(),
            TypeValidation::Rating { .. } => "rating".to_string(),
            TypeValidation::ProgressBar { .. } => "progress_bar".to_string(),
        }
    }

    pub fn format(&self, re: RowElement) -> RowElement {
        match &self {
            TypeValidation::Number {
                is_integer, format, ..
            } => {
                let number = match re {
                    RowElement::Number(IntOrFloat::Int(i)) => i as f64,
                    RowElement::Number(IntOrFloat::Float(f)) => f,
                    _ => 0.0,
                };
                RowElement::Text(format.format_number(number, *is_integer))
            }
            TypeValidation::Percentage { format, .. } => {
                let number = match re {
                    RowElement::Number(IntOrFloat::Int(i)) => i as f64,
                    RowElement::Number(IntOrFloat::Float(f)) => f,
                    _ => 0.0,
                };
                RowElement::Text(format.format_number(number, false))
            }

            TypeValidation::Text { .. } => re,
            TypeValidation::Date { format, .. } => {
                let date = match re {
                    RowElement::Date(d) => d,
                    _ => Utc::now().naive_utc().date(),
                };
                RowElement::Text(format.format_date(&date))
            }
            TypeValidation::DateTime { format, .. }
            | TypeValidation::CreatedAt { format }
            | TypeValidation::UpdatedAt { format } => {
                let datetime = match re {
                    RowElement::DateTime(d) => d,
                    _ => Utc::now().naive_utc(),
                };
                RowElement::Text(format.format_datetime(&datetime))
            }
            TypeValidation::Currency { symbol, format, .. } => {
                let number = match re {
                    RowElement::Number(IntOrFloat::Int(i)) => i as f64,
                    RowElement::Number(IntOrFloat::Float(f)) => f,
                    _ => 0.0,
                };
                RowElement::Text(symbol.clone().map_or_else(
                    || format.format_number(number, false),
                    |t| format!("{} {}", t, format.format_number(number, false)),
                ))
            }
            TypeValidation::CreatedBy {} | TypeValidation::LastModifiedBy {} => re,
            TypeValidation::AutoNumber {} => match re {
                RowElement::Number(IntOrFloat::Int(i)) => RowElement::Text(i.to_string()),
                _ => RowElement::Text("invalid".to_string()),
            },

            TypeValidation::ProgressBar { .. } | TypeValidation::Rating { .. } => {
                let number = match re {
                    RowElement::Number(IntOrFloat::Int(i)) => i as f64,
                    RowElement::Number(IntOrFloat::Float(f)) => f,
                    _ => 0.0,
                };
                RowElement::Text(format!("{}", number))
            }
            _ => re,
        }
    }
    pub fn get_pg_type(&self) -> String {
        match &self {
            TypeValidation::Number {
                is_integer,
                precision,
                ..
            } => {
                if *is_integer {
                    "BIGINT".to_string()
                } else {
                    format!("NUMERIC(50, {})", precision.unwrap_or(0))
                }
            }
            TypeValidation::Text { .. } => "TEXT".to_string(),
            TypeValidation::Date { .. } => "DATE".to_string(),
            TypeValidation::DateTime { .. } => "TIMESTAMP".to_string(),
            TypeValidation::Email { .. } => "TEXT".to_string(),
            TypeValidation::Url { .. } => "TEXT".to_string(),
            TypeValidation::Attachment { .. } => "TEXT".to_string(),
            TypeValidation::MultipleSelect { .. } => "TEXT[]".to_string(),
            TypeValidation::SingleSelect { .. } => "TEXT".to_string(),
            TypeValidation::PhoneNumber { default: _ } => "TEXT".to_string(),
            TypeValidation::Currency { decimal_places, .. } => {
                format!("NUMERIC(50, {})", decimal_places)
            }
            TypeValidation::Percentage { decimal_places, .. } => {
                format!("NUMERIC(50, {})", decimal_places)
            }
            TypeValidation::CreatedBy {} => "BIGINT".to_string(),
            TypeValidation::LastModifiedBy {} => "BIGINT".to_string(),
            TypeValidation::AutoNumber {} => "BIGSERIAL".to_string(),
            TypeValidation::Formula { .. } => "virtual".to_string(),
            TypeValidation::Checkbox { style: _, .. } => "BOOLEAN".to_string(),
            TypeValidation::User { allow_multiple, .. } => {
                if *allow_multiple {
                    "BIGINT[]".to_string()
                } else {
                    "BIGINT".to_string()
                }
            }
            TypeValidation::CreatedAt { .. } => "TIMESTAMP".to_string(),
            TypeValidation::UpdatedAt { .. } => "TIMESTAMP".to_string(),
            TypeValidation::Rating {
                allowed_decimal, ..
            } => {
                if *allowed_decimal {
                    "NUMERIC(50, 2)".to_string()
                } else {
                    "BIGINT".to_string()
                }
            }
            TypeValidation::ProgressBar {
                allowed_decimal, ..
            } => {
                if *allowed_decimal {
                    "NUMERIC(50, 2)".to_string()
                } else {
                    "BIGINT".to_string()
                }
            }
        }
    }
}

// impl FromSql<Jsonb, Pg> for YourJsonbStruct {
//     fn from_sql(bytes: PgValue<'_>) -> deserialize::Result<Self> {
//         let value = serde_json::from_slice::<serde_json::Value>(bytes.as_bytes())?;
//         serde_json::from_value(value).map_err(Into::into)
//     }
// }
//
// impl ToSql<Jsonb, Pg> for YourJsonbStruct {
//     fn to_sql<W: std::io::Write>(&self, out: &mut Output<W, Pg>) -> serialize::Result {
//         let json = serde_json::to_string(self)?;
//         out.write_all(json.as_bytes())?;
//         Ok(IsNull::No)
//     }
// }

impl ToSql<Jsonb, Pg> for TypeValidation {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
        let json = serde_json::to_vec(self)?;
        out.write_all(&[1])?; // Adding the b"\x01" prefix
        out.write_all(&json)?;
        Ok(serialize::IsNull::No)
    }
}

// Implement FromSql for MyEnum
impl FromSql<Jsonb, Pg> for TypeValidation {
    fn from_sql(bytes: PgValue<'_>) -> deserialize::Result<Self> {
        let json_bytes = bytes.as_bytes();
        if json_bytes[0] != 1 {
            return Err("Unsupported jsonb version number".into());
        }
        serde_json::from_slice(&json_bytes[1..]).map_err(Into::into)
    }
}

#[derive(Queryable, Debug, Serialize, Deserialize, Changeset, View)]
pub struct AppColumn {
    #[skip_in_changeset]
    pub id: i64,
    pub name: String,
    pub real_name: String,
    pub description: Option<String>,
    pub table_id: i64,
    pub type_validation: TypeValidation,
    pub display_order: i32,
    pub is_primary: bool,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

impl AppColumn {
    pub fn find_by_table_id(
        conn: &mut PgConnection,
        table_id: i64,
    ) -> Result<Vec<AppColumn>, Error> {
        app_columns::table
            .filter(app_columns::table_id.eq(table_id))
            .load::<AppColumn>(conn)
    }

    pub fn default_value(&self, current_user_id: i64) -> RowElement {
        match &self.type_validation {
            TypeValidation::Number {
                is_integer,
                default,
                ..
            } => {
                if *is_integer {
                    let default = default
                        .as_ref()
                        .unwrap_or(&"0".to_string())
                        .parse::<i64>()
                        .unwrap_or(0);
                    RowElement::Number(IntOrFloat::Int(default))
                } else {
                    let default = default
                        .as_ref()
                        .unwrap_or(&"0.0".to_string())
                        .parse::<f64>()
                        .unwrap_or(0.0);
                    RowElement::Number(IntOrFloat::Float(default))
                }
            }
            TypeValidation::Text { default, .. } => {
                if default.is_some() {
                    RowElement::Text(default.clone().unwrap())
                } else {
                    RowElement::None
                }
            }
            TypeValidation::Email { default } => {
                if default.is_some() {
                    RowElement::Text(default.clone().unwrap())
                } else {
                    RowElement::None
                }
            }
            TypeValidation::Url { default } => {
                if default.is_some() {
                    RowElement::Text(default.clone().unwrap())
                } else {
                    RowElement::None
                }
            }
            TypeValidation::Attachment { default, .. } => {
                if default.is_some() {
                    RowElement::Text(default.clone().unwrap())
                } else {
                    RowElement::None
                }
            }
            TypeValidation::MultipleSelect { default, .. } => {
                if default.is_some() {
                    RowElement::ArrayString(default.clone().unwrap())
                } else {
                    RowElement::None
                }
            }
            TypeValidation::SingleSelect { default, .. } => {
                if default.is_some() {
                    RowElement::Text(default.clone().unwrap())
                } else {
                    RowElement::None
                }
            }
            TypeValidation::PhoneNumber { default } => {
                if default.is_some() {
                    RowElement::Text(default.clone().unwrap())
                } else {
                    RowElement::None
                }
            }
            TypeValidation::Currency { default, .. } => {
                if default.is_some() {
                    let default = default
                        .clone()
                        .unwrap_or_default()
                        .parse::<f64>()
                        .unwrap_or_default();
                    RowElement::Number(IntOrFloat::Float(default))
                } else {
                    RowElement::None
                }
            }
            TypeValidation::Percentage { default, .. } => {
                if default.is_some() {
                    let default = default
                        .clone()
                        .unwrap_or_default()
                        .parse::<f64>()
                        .unwrap_or_default();
                    RowElement::Number(IntOrFloat::Float(default))
                } else {
                    RowElement::None
                }
            }
            TypeValidation::Checkbox { default, .. } => RowElement::Boolean(*default),
            TypeValidation::User { default, .. } => {
                if default.is_some() {
                    match default.clone().unwrap() {
                        VecOrSingle::Vec(v) => {
                            RowElement::ArrayNumber(v.iter().map(|x| IntOrFloat::Int(*x)).collect())
                        }
                        VecOrSingle::Single(s) => RowElement::Number(IntOrFloat::Int(s)),
                    }
                } else {
                    RowElement::None
                }
            }
            TypeValidation::Rating { default, .. } => {
                if default.is_some() {
                    RowElement::Number(IntOrFloat::Int(default.unwrap_or_default() as i64))
                } else {
                    RowElement::None
                }
            }
            TypeValidation::ProgressBar { default, .. } => {
                if default.is_some() {
                    RowElement::Number(IntOrFloat::Int(default.unwrap_or_default() as i64))
                } else {
                    RowElement::None
                }
            }
            TypeValidation::Date {
                default_to_current, ..
            } => {
                if *default_to_current {
                    RowElement::Number(IntOrFloat::Int(current_user_id))
                } else {
                    RowElement::None
                }
            }
            TypeValidation::DateTime {
                default_to_current, ..
            } => {
                if *default_to_current {
                    RowElement::DateTime(Utc::now().naive_utc())
                } else {
                    RowElement::None
                }
            }
            TypeValidation::CreatedBy {} => RowElement::Number(IntOrFloat::Int(current_user_id)),
            TypeValidation::LastModifiedBy {} => {
                RowElement::Number(IntOrFloat::Int(current_user_id))
            }
            TypeValidation::AutoNumber {} => RowElement::None,
            TypeValidation::Formula { .. } => RowElement::None,
            TypeValidation::CreatedAt { .. } => RowElement::DateTime(Utc::now().naive_utc()),
            TypeValidation::UpdatedAt { .. } => RowElement::DateTime(Utc::now().naive_utc()),
        }
    }
}

impl AppColumnView {
    pub fn default_value(&self) -> RowElement {
        match &self.type_validation {
            TypeValidation::Number {
                is_integer,
                default,
                ..
            } => {
                if *is_integer {
                    let default = default
                        .as_ref()
                        .unwrap_or(&"0".to_string())
                        .parse::<i64>()
                        .unwrap_or(0);
                    RowElement::Number(IntOrFloat::Int(default))
                } else {
                    let default = default
                        .as_ref()
                        .unwrap_or(&"0.0".to_string())
                        .parse::<f64>()
                        .unwrap_or(0.0);
                    RowElement::Number(IntOrFloat::Float(default))
                }
            }
            TypeValidation::Text { default, .. } => {
                if default.is_some() {
                    RowElement::Text(default.clone().unwrap())
                } else {
                    RowElement::None
                }
            }
            TypeValidation::Email { default } => {
                if default.is_some() {
                    RowElement::Text(default.clone().unwrap())
                } else {
                    RowElement::None
                }
            }
            TypeValidation::Url { default } => {
                if default.is_some() {
                    RowElement::Text(default.clone().unwrap())
                } else {
                    RowElement::None
                }
            }
            TypeValidation::Attachment { default, .. } => {
                if default.is_some() {
                    RowElement::Text(default.clone().unwrap())
                } else {
                    RowElement::None
                }
            }
            TypeValidation::MultipleSelect { default, .. } => {
                if default.is_some() {
                    RowElement::ArrayString(default.clone().unwrap())
                } else {
                    RowElement::None
                }
            }
            TypeValidation::SingleSelect { default, .. } => {
                if default.is_some() {
                    RowElement::Text(default.clone().unwrap())
                } else {
                    RowElement::None
                }
            }
            TypeValidation::PhoneNumber { default } => {
                if default.is_some() {
                    RowElement::Text(default.clone().unwrap())
                } else {
                    RowElement::None
                }
            }
            TypeValidation::Currency { default, .. } => {
                if default.is_some() {
                    let default = default
                        .clone()
                        .unwrap_or_default()
                        .parse::<f64>()
                        .unwrap_or_default();
                    RowElement::Number(IntOrFloat::Float(default))
                } else {
                    RowElement::None
                }
            }
            TypeValidation::Percentage { default, .. } => {
                if default.is_some() {
                    let default = default
                        .clone()
                        .unwrap_or_default()
                        .parse::<f64>()
                        .unwrap_or_default();
                    RowElement::Number(IntOrFloat::Float(default))
                } else {
                    RowElement::None
                }
            }
            TypeValidation::Checkbox { default, .. } => RowElement::Boolean(*default),
            TypeValidation::User { default, .. } => {
                if default.is_some() {
                    match default.clone().unwrap() {
                        VecOrSingle::Vec(v) => {
                            RowElement::ArrayNumber(v.iter().map(|x| IntOrFloat::Int(*x)).collect())
                        }
                        VecOrSingle::Single(s) => RowElement::Number(IntOrFloat::Int(s)),
                    }
                } else {
                    RowElement::None
                }
            }
            TypeValidation::Rating { default, .. } => {
                if default.is_some() {
                    RowElement::Number(IntOrFloat::Int(default.unwrap_or_default() as i64))
                } else {
                    RowElement::None
                }
            }
            TypeValidation::ProgressBar { default, .. } => {
                if default.is_some() {
                    RowElement::Number(IntOrFloat::Int(default.unwrap_or_default() as i64))
                } else {
                    RowElement::None
                }
            }
            _ => RowElement::None,
        }
    }
}
