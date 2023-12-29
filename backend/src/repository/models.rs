// Generated by diesel_ext

#![allow(unused)]
#![allow(clippy::all)]

use std::io::Write;

use crate::app::databases::DBConfig;
use crate::app::results::adapters::DBAdapter;

use super::schema::*;
use chrono::{DateTime, NaiveDate, NaiveDateTime};
use diesel::deserialize::{self, FromSql, FromSqlRow};
use diesel::expression::AsExpression;
use diesel::pg::PgValue;
use diesel::prelude::*;
use diesel::serialize::{self, IsNull, Output, ToSql};
use diesel::sql_types::SqlType;
use diesel::{
    pg::Pg,
    sql_types::{Array, Float8, Int4, VarChar},
    PgConnection,
};
use serde_json;

use diesel::result::Error;
use serde::{Deserialize, Serialize};

use crud_derive::{Changeset, DatabaseEnum, View};

use chrono::Utc;

use diesel::debug_query;

use std::fmt;

use diesel::sql_types::HasSqlType;
// pub trait Crud<T> {
//     fn create(conn: &mut PgConnection, model: &T) -> Result<T, Error>;
//     fn read(conn: &mut PgConnection, id: i32) -> Result<T, Error>;
//     fn update(conn: &mut PgConnection, id: i32, updated_model: &T) -> Result<T, Error>;
//     fn delete(conn: &mut PgConnection, id: i32) -> Result<(), Error>;
// }
//
//

#[derive(Debug)]
pub struct CustomEnumError {
    msg: String,
    status: u16,
}

impl CustomEnumError {
    fn not_found(msg: String) -> Self {
        Self { msg, status: 404 }
    }
}

use uuid::Uuid;
#[derive(Queryable, Debug)]
pub struct AlertEvent {
    pub id: i64,
    pub alert_setting_id: i64,
    pub alert_level: i32,
    pub original_data: Option<serde_json::Value>,
    pub transformed_data_column_name: Option<String>,
    pub is_data_saved: bool,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug)]
pub struct AlertEventsTransformedData {
    pub id: i64,
    pub value: Option<String>,
    pub level: i32,
    pub alert_event_id: i64,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug)]
pub struct AlertLevelSetting {
    pub id: i64,
    pub level: i32,
    pub value: String,
    pub alert_setting_id: i64,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug)]
pub struct AlertNotificationSetting {
    pub id: i64,
    pub method: i32,
    pub recipients: Vec<Option<String>>,
    pub alert_setting_id: i64,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug)]
pub struct AlertSetting {
    pub id: i64,
    pub name: String,
    pub question_id: i64,
    pub column: String,
    pub aggregation: i32,
    pub number_of_rows: i32,
    pub operation: i32,
    pub traversal: i32,
    pub is_active: bool,
    pub frequency_value_in_seconds: i32,
    pub start_time: NaiveDateTime,
    pub scheduled_disabled_config: Option<serde_json::Value>,
    pub silent_till: Option<NaiveDateTime>,
    pub next_run_time: Option<NaiveDateTime>,
    pub status: Option<i32>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug)]
pub struct Alert {
    pub id: i64,
    pub name: Option<String>,
    pub config: Option<serde_json::Value>,
    pub question_id: Option<i64>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug)]
pub struct ApiActionLog {
    pub id: i64,
    pub api_action_id: Option<i64>,
    pub url: String,
    pub request_headers: Option<serde_json::Value>,
    pub response_headers: Option<serde_json::Value>,
    pub request_body: Option<String>,
    pub response_body: Option<String>,
    pub request_method: Option<i32>,
    pub status_code: Option<i32>,
    pub variables: Option<Vec<Option<String>>>,
    pub user_id: Option<i64>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(
    Debug, PartialEq, FromSqlRow, AsExpression, Eq, Serialize, Deserialize, Clone, DatabaseEnum,
)]
#[diesel(sql_type = Int4)]
#[serde(rename_all = "snake_case")]
pub enum ActionLevel {
    QuestionResponse = 1,
    Question = 2,
}

#[derive(
    Debug,
    PartialEq,
    FromSqlRow,
    AsExpression,
    Eq,
    Serialize,
    Deserialize,
    Clone,
    DatabaseEnum,
    Default,
)]
#[diesel(sql_type = Int4)]
pub enum HTTPMethod {
    #[default]
    GET = 1,
    POST = 2,
    PUT = 3,
    DELETE = 4,
    PATCH = 5,
}

#[derive(Queryable, Debug, Changeset, View, Serialize, Deserialize, Default, Clone)]
#[view_skip_fields = "on_success, on_failure, failure_message, failure_key, success_message, success_key, action_level"]
pub struct ApiAction {
    #[skip_in_changeset]
    pub id: i64,
    pub question_id: Option<i64>,
    pub url: String,
    pub headers: Option<serde_json::Value>,
    pub body: Option<String>,
    pub method: Option<HTTPMethod>,
    pub name: Option<String>,
    pub color: Option<String>,
    pub open_in_new_tab: Option<bool>,
    pub response_settings: Option<serde_json::Value>,
    pub hidden: Option<bool>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
    pub column: Option<String>,
    pub on_success: Option<i32>,
    pub on_failure: Option<i32>,
    pub failure_message: Option<String>,
    pub failure_key: Option<String>,
    pub success_message: Option<String>,
    pub success_key: Option<String>,
    pub action_level: Option<ActionLevel>,
    pub visualization_id: Option<i64>,
    pub loading_message: Option<String>,
    pub display_settings: Option<serde_json::Value>,
    pub open_option: Option<String>,
}

#[derive(Queryable, Debug)]
pub struct Application {
    pub id: i64,
    pub name: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug)]
pub struct AuditLog {
    pub id: i64,
    pub whodunit: Option<i32>,
    pub action: Option<i32>,
    pub additional_data: Option<serde_json::Value>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug)]
pub struct ColumnValue {
    pub id: i64,
    pub name: Option<String>,
    pub value: Option<String>,
    pub column_id: Option<i64>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug, Serialize, Deserialize, Changeset, View)]
#[table_name = "columns_"]
pub struct Column {
    #[skip_in_changeset]
    pub id: i64,
    pub name: Option<String>,
    pub table_id: Option<i64>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
    pub data_type: Option<String>,
    pub description: Option<String>,
    pub primary_key: Option<bool>,
}

#[derive(
    Debug, PartialEq, FromSqlRow, AsExpression, Eq, Serialize, Deserialize, Clone, Default,
)]
#[diesel(sql_type = VarChar)]
#[serde(rename_all = "snake_case")]
pub enum WidgetTypes {
    #[default]
    NoWidget,
    Visualization,
    #[serde(rename = "variablePane")]
    VariablePane,
    Note,
    Tabs,
}

impl ToSql<VarChar, Pg> for WidgetTypes {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
        let value: String = match *self {
            WidgetTypes::Visualization => "visualization".to_string(),
            WidgetTypes::VariablePane => "variablePane".to_string(),
            WidgetTypes::Note => "note".to_string(),
            WidgetTypes::Tabs => "tabs".to_string(),
            WidgetTypes::NoWidget => "no_widget".to_string(),
        };
        let mut new_out = out.reborrow();
        ToSql::<VarChar, Pg>::to_sql(&value, &mut new_out)
    }
}

impl FromSql<VarChar, Pg> for WidgetTypes {
    fn from_sql(bytes: PgValue<'_>) -> deserialize::Result<Self> {
        match String::from_sql(bytes)?.as_str() {
            "visualization" => Ok(WidgetTypes::Visualization),
            "variablePane" => Ok(WidgetTypes::VariablePane),
            "note" => Ok(WidgetTypes::Note),
            "tabs" => Ok(WidgetTypes::Tabs),
            _ => Err(format!(
                "Unrecognized enum value: {}",
                String::from_sql(bytes)?.as_str()
            )
            .into()),
        }
    }
}

#[derive(Queryable, Debug, Serialize, Deserialize, Changeset, View)]
#[id_data_type = "i64"]
pub struct DashboardWidget {
    #[skip_in_changeset]
    pub id: i64,
    pub widget_type: Option<WidgetTypes>,
    pub widget_id: Option<i64>,
    pub dashboard_id: Option<i64>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug, Serialize, Deserialize, Changeset, View)]
#[view_skip_fields = "shareable_link, is_shareable_link_public"]
pub struct Dashboard {
    #[skip_in_changeset]
    pub id: i64,
    pub title: Option<String>,
    pub update_interval: Option<i32>,
    pub last_updated: Option<NaiveDateTime>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
    pub description: Option<String>,
    pub shareable_link: Option<Uuid>,
    pub is_shareable_link_public: Option<bool>,
    pub settings: Option<serde_json::Value>,
    pub shared_to: Option<Vec<Option<String>>>,
    pub owner_id: Option<i64>,
    pub notes_settings: Option<serde_json::Value>,
}

#[derive(Debug, PartialEq, FromSqlRow, AsExpression, Eq, Serialize, Deserialize, Clone)]
#[diesel(sql_type = VarChar)]
#[serde(rename_all = "snake_case")]
pub enum SupportedDatabases {
    ApiClient,
    Postgres,
    Redshift,
    Mysql,
    Clickhouse,
    Redis,
    Influx,
    Mongo,
}

impl ToSql<VarChar, Pg> for SupportedDatabases {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
        let value: String = match *self {
            SupportedDatabases::Postgres => "postgres".to_string(),
            SupportedDatabases::Mysql => "mysql".to_string(),
            SupportedDatabases::Clickhouse => "clickhouse".to_string(),
            SupportedDatabases::Redis => "redis".to_string(),
            SupportedDatabases::Influx => "influx".to_string(),
            SupportedDatabases::Mongo => "mongo".to_string(),
            SupportedDatabases::Redshift => "redshift".to_string(),
            SupportedDatabases::ApiClient => "api_client".to_string(),
        };
        let mut new_out = out.reborrow();
        ToSql::<VarChar, Pg>::to_sql(&value, &mut new_out)
    }
}

impl FromSql<VarChar, Pg> for SupportedDatabases {
    fn from_sql(bytes: PgValue<'_>) -> deserialize::Result<Self> {
        match String::from_sql(bytes)?.as_str() {
            "postgres" => Ok(SupportedDatabases::Postgres),
            "mysql" => Ok(SupportedDatabases::Mysql),
            "clickhouse" => Ok(SupportedDatabases::Clickhouse),
            "redis" => Ok(SupportedDatabases::Redis),
            "influx" => Ok(SupportedDatabases::Influx),
            "mongo" => Ok(SupportedDatabases::Mongo),
            "redshift" => Ok(SupportedDatabases::Redshift),
            "api_client" => Ok(SupportedDatabases::ApiClient),
            _ => Err(format!(
                "Unrecognized enum value: {}",
                String::from_sql(bytes)?.as_str()
            )
            .into()),
        }
    }
}

#[derive(Queryable, Debug, Insertable, AsChangeset, Serialize, Deserialize, Changeset)]
pub struct Database {
    #[skip_in_changeset]
    pub id: i64,
    pub name: Option<String>,
    pub db_type: Option<SupportedDatabases>,
    pub config: Option<serde_json::Value>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub last_accessed_at: Option<NaiveDateTime>,
    pub unique_identifier: Option<Uuid>,
}

#[derive(
    Debug, PartialEq, FromSqlRow, AsExpression, Eq, Serialize, Deserialize, Clone, DatabaseEnum,
)]
#[diesel(sql_type = Int4)]
#[serde(rename_all = "snake_case")]
pub enum FkType {
    Fk = 0,
    Guess = 1,
    UserDefined = 2,
}

#[derive(Queryable, Debug, Insertable, AsChangeset, Serialize, Deserialize, Changeset)]
pub struct ForeignKey {
    #[skip_in_changeset]
    pub id: i64,
    pub name: Option<String>,
    pub fk_type: Option<FkType>,
    pub column_id: Option<i64>,
    pub foreign_column_id: Option<i64>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug)]
pub struct GeneratedAlert {
    pub id: i64,
    pub alert_id: Option<i64>,
    pub status: Option<i32>,
    pub failing_conditions: Option<Vec<Option<serde_json::Value>>>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug, Serialize, Deserialize, Changeset, View)]
pub struct Note {
    #[skip_in_changeset]
    pub id: i64,
    pub content: String,
    pub dashboard_id: Option<i64>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug, Serialize, Deserialize, Changeset, View)]
#[id_data_type = "i64"]
pub struct OrganizationSetting {
    #[skip_in_changeset]
    pub id: i64,
    pub name: String,
    pub value: Option<String>,
    pub setting_type: i32,
    pub organization_id: i64,
    pub api_action_id: Option<i64>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug, Serialize, Deserialize, Changeset, View)]
#[id_data_type = "i64"]
pub struct Organization {
    #[skip_in_changeset]
    pub id: i64,
    pub name: String,
    pub google_domain: String,
    pub is_deactivated: bool,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug, Serialize, Deserialize, Changeset, View)]
pub struct PermissionSet {
    pub id: i64,
    pub name: Option<String>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug, Insertable, AsChangeset, Serialize, Deserialize)]
pub struct Permission {
    pub id: i64,
    pub permission_set_id: Option<i64>,
    pub name: Option<String>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug)]
pub struct QuestionBank {
    pub id: i64,
    pub title: Option<String>,
    pub questions: Option<Vec<Option<i32>>>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug)]
pub struct QuestionWidget {
    pub id: i64,
    pub widget_id: Option<i64>,
    pub question_id: Option<i64>,
}

#[derive(
    Debug, PartialEq, FromSqlRow, AsExpression, Eq, Serialize, Deserialize, Clone, DatabaseEnum,
)]
#[diesel(sql_type = Int4)]
#[serde(rename_all = "snake_case")]
pub enum QueryType {
    HumanSql = 0,
    Sql = 1,
    ApiClient = 2,
}

#[derive(Queryable, Debug, Serialize, Deserialize, Changeset, View, Default)]
// #[view_skip_fields = "results_view_settings, cached_results, columns"]
pub struct Question {
    #[skip_in_changeset]
    pub id: i64,
    pub title: Option<String>,
    pub last_updated: Option<NaiveDateTime>,
    pub sql: Option<String>,
    pub human_sql: Option<serde_json::Value>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
    pub query_type: Option<QueryType>,
    pub shareable_link: Option<Uuid>,
    pub is_shareable_link_public: Option<bool>,
    pub results_view_settings: Option<serde_json::Value>,
    pub columns_: Option<Vec<Option<String>>>,
    pub cached_results: Option<serde_json::Value>,
    pub shared_to: Option<Vec<Option<String>>>,
    pub owner_id: Option<i64>,
    pub config: Option<serde_json::Value>,
}

#[derive(Queryable, Debug)]
pub struct ResultsCache {
    pub id: i64,
    pub key: Option<String>,
    pub sql: Option<String>,
    pub data: Option<serde_json::Value>,
    pub expiry_time: Option<NaiveDateTime>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug)]
pub struct RulesEnginePermission {
    pub id: i64,
    pub role_id: i64,
    pub name: i32,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug)]
pub struct RulesEngineRole {
    pub id: i64,
    pub name: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug)]
pub struct RulesEngineUser {
    pub id: i64,
    pub name: Option<String>,
    pub email: String,
    pub is_deactivated: bool,
    pub profile_pic: Option<String>,
    pub metadata: Option<serde_json::Value>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(
    Debug, PartialEq, FromSqlRow, AsExpression, Eq, Serialize, Deserialize, Clone, Default,
)]
#[diesel(sql_type = VarChar)]
pub enum TimeUnit {
    #[default]
    Hour,
    Day,
    Week,
    Month,
}

impl ToSql<VarChar, Pg> for TimeUnit {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
        let value: String = match *self {
            TimeUnit::Hour => "Hour".to_string(),
            TimeUnit::Day => "Day".to_string(),
            TimeUnit::Week => "Week".to_string(),
            TimeUnit::Month => "Month".to_string(),
        };
        let mut new_out = out.reborrow();
        ToSql::<VarChar, Pg>::to_sql(&value, &mut new_out)
    }
}

impl FromSql<VarChar, Pg> for TimeUnit {
    fn from_sql(bytes: PgValue<'_>) -> deserialize::Result<Self> {
        match String::from_sql(bytes)?.as_str() {
            "Hour" => Ok(TimeUnit::Hour),
            "Day" => Ok(TimeUnit::Day),
            "Week" => Ok(TimeUnit::Week),
            "Month" => Ok(TimeUnit::Month),
            _ => Err(format!(
                "Unrecognized enum value: {}",
                String::from_sql(bytes)?.as_str()
            )
            .into()),
        }
    }
}

#[derive(
    Queryable, Debug, Serialize, Deserialize, Changeset, View, QueryableByName, Clone, Default,
)]
#[id_data_type = "i64"]
pub struct Schedule {
    #[skip_in_changeset]
    pub id: i64,
    pub every: Option<i32>,
    pub time_unit: Option<TimeUnit>,
    pub time_details: Option<Vec<Option<serde_json::Value>>>,
    #[skip_in_changeset]
    pub next_execution_time: Option<NaiveDateTime>,
    #[skip_in_changeset]
    pub is_running: Option<bool>,
    pub job_details: Option<serde_json::Value>,
    pub is_active: Option<bool>,
    pub recipients: Option<Vec<Option<String>>>,
    pub timezone: Option<String>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub subject: Option<String>,
}

#[derive(Queryable, Debug)]
pub struct SearchableColumn {
    pub id: i64,
    pub name: Option<String>,
    pub snapshot_id: Option<i64>,
    pub value: Option<String>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub snapshot_data_identifier: Option<Uuid>,
}

#[derive(Queryable, Debug)]
pub struct SendAlertConfig {
    pub id: i64,
    pub alert_id: Option<i64>,
    pub message_template: Option<String>,
    pub comm_type: Option<i32>,
    pub to_addresses: Option<Vec<Option<String>>>,
    pub subject_template: Option<String>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug, Serialize, Deserialize, Changeset, View)]
pub struct Setting {
    #[skip_in_changeset]
    pub id: i64,
    pub name: String,
    pub value: Option<String>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug)]
pub struct SheetConfig {
    pub id: i64,
    pub name: Option<String>,
    pub table_name: Option<String>,
    pub refresh_interval: Option<i32>,
    pub sheet_id: Option<String>,
    pub subsheet_id: Option<i64>,
    pub api_key_id: Option<i64>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug)]
pub struct SnapshotData {
    pub id: i64,
    pub row: serde_json::Value,
    pub snapshot_id: Option<i64>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub identifier: Option<Uuid>,
}

#[derive(Queryable, Debug)]
pub struct Snapshot {
    pub id: i64,
    pub name: String,
    pub description: Option<String>,
    pub columns_: Option<Vec<Option<String>>>,
    pub question_id: i32,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub scheduled: Option<bool>,
    pub interval: Option<i32>,
    pub starting_at: Option<NaiveDateTime>,
    pub status: Option<i32>,
    pub should_save_data_to_db: Option<bool>,
    pub should_create_csv: Option<bool>,
    pub should_send_mail_on_completion: Option<bool>,
    pub mail_to: Option<Vec<Option<String>>>,
    pub parent_id: Option<i64>,
    pub searchable_columns: Option<Vec<Option<String>>>,
    pub keep_latest: Option<i32>,
}

#[derive(Queryable, Debug, Serialize, Deserialize, Changeset, View, Default)]
#[id_data_type = "i64"]
pub struct Snippet {
    #[skip_in_changeset]
    pub id: i64,
    pub name: Option<String>,
    pub text: Option<String>,
    pub database_id: Option<i64>,
    pub owner_id: Option<i64>,
    pub expand_on_select: Option<bool>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug, Serialize, Deserialize, Changeset, View)]
pub struct Table {
    #[skip_in_changeset]
    pub id: i64,
    pub name: Option<String>,
    pub database_id: Option<i64>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
    pub readable_table_name: Option<String>,
    pub description: Option<String>,
}

#[derive(Queryable, Debug)]
pub struct TagDashboard {
    pub id: i64,
    pub tag_id: Option<i64>,
    pub dashboard_id: Option<i64>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug, Serialize, Deserialize, Changeset, View)]
pub struct TagQuestion {
    #[skip_in_changeset]
    pub id: i64,
    pub tag_id: Option<i64>,
    pub question_id: Option<i64>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug, Serialize, Deserialize, Changeset, View)]
pub struct Tag {
    #[skip_in_changeset]
    pub id: i64,
    pub name: String,
    pub description: Option<String>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
    pub color: Option<String>,
}

#[derive(Queryable, Debug, Changeset, View, Serialize, Deserialize)]
pub struct TeamDatabase {
    #[skip_in_changeset]
    pub id: i64,
    pub database_id: Option<i64>,
    pub team_id: Option<i64>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug, Serialize, Deserialize, View, Changeset)]
#[view_skip_fields("field_to_skip")]
pub struct Team {
    #[skip_in_changeset]
    pub id: i64,
    pub name: String,
    pub description: Option<String>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug, Serialize, Deserialize, Changeset, View)]
pub struct UserPermissionSet {
    #[skip_in_changeset]
    pub id: i64,
    pub user_id: Option<i64>,
    pub permission_set_id: Option<i64>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

// #[derive(SqlType)]
// #[diesel(postgres_type(name = "My_Type"))]
// pub struct MyType;

#[derive(
    Debug,
    PartialEq,
    FromSqlRow,
    AsExpression,
    Eq,
    Serialize,
    Deserialize,
    Clone,
    DatabaseEnum,
    Default,
)]
#[diesel(sql_type = Int4)]
#[serde(rename_all = "lowercase")]
pub enum SettingsTypes {
    #[default]
    General = 1,
    Variable = 2,
}

#[derive(Queryable, Debug, Serialize, Deserialize, Changeset, View)]
#[id_data_type = "i64"]
pub struct UserSetting {
    pub id: i64,
    pub name: String,
    pub value: Option<String>,
    pub setting_type: SettingsTypes,
    pub user_id: i64,
    pub api_action_id: Option<i64>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug, Changeset, Serialize, Deserialize)]
pub struct UserTeam {
    #[skip_in_changeset]
    pub id: i64,
    pub user_id: Option<i64>,
    pub team_id: Option<i64>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug, Serialize, Deserialize, Changeset, View)]
pub struct User {
    #[skip_in_changeset]
    pub id: i64,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<String>,
    pub full_name: Option<String>,
    pub profile_pic: Option<String>,
    pub metadata: Option<serde_json::Value>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
    pub is_deactivated: Option<bool>,
    pub organization_id: Option<i64>,
    pub password: Option<String>,
}

#[derive(
    Debug, PartialEq, FromSqlRow, AsExpression, Eq, Serialize, Deserialize, Clone, Default,
)]
#[diesel(sql_type = VarChar)]
pub enum VariableType {
    #[default]
    String,
    Integer,
    Date,
}

impl ToSql<VarChar, Pg> for VariableType {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
        let value: String = match *self {
            VariableType::String => "String".to_string(),
            VariableType::Integer => "Integer".to_string(),
            VariableType::Date => "Date".to_string(),
        };
        let mut new_out = out.reborrow();
        ToSql::<VarChar, Pg>::to_sql(&value, &mut new_out)
    }
}

impl FromSql<VarChar, Pg> for VariableType {
    fn from_sql(bytes: PgValue<'_>) -> deserialize::Result<Self> {
        match String::from_sql(bytes)?.as_str() {
            "String" => Ok(VariableType::String),
            "Integer" => Ok(VariableType::Integer),
            "Date" => Ok(VariableType::Date),
            _ => Err(format!(
                "Unrecognized enum value: {}",
                String::from_sql(bytes)?.as_str()
            )
            .into()),
        }
    }
}
#[derive(Queryable, Debug, Serialize, Deserialize, Changeset, View)]
#[view_skip_fields = "default_operator, default_options, question_filter_id, column_id"]
pub struct Variable {
    #[skip_in_changeset]
    pub id: i64,
    pub name: Option<String>,
    pub default: Option<String>,
    pub var_type: Option<VariableType>,
    pub column_id: Option<i64>,
    pub question_id: Option<i64>,
    pub dashboard_id: Option<i64>,
    pub default_operator: Option<String>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
    pub question_filter_id: Option<i64>,
    pub default_options: Option<Vec<Option<serde_json::Value>>>,
}

#[derive(
    Debug, PartialEq, FromSqlRow, AsExpression, Eq, Serialize, Deserialize, Clone, Default,
)]
#[diesel(sql_type = VarChar)]
#[serde(rename_all = "camelCase")]
pub enum RendererTypes {
    Area,
    Bar,
    Bubble,
    CustomList,
    Funnel,
    Line,
    Number,
    Pie,
    #[default]
    Table,
    #[serde(rename = "transposed_table")]
    TransposedTable,
}

impl fmt::Display for RendererTypes {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            RendererTypes::Area => write!(f, "area"),
            RendererTypes::Bar => write!(f, "bar"),
            RendererTypes::Bubble => write!(f, "bubble"),
            RendererTypes::CustomList => write!(f, "customList"),
            RendererTypes::Funnel => write!(f, "funnel"),
            RendererTypes::Line => write!(f, "line"),
            RendererTypes::Number => write!(f, "number"),
            RendererTypes::Pie => write!(f, "pie"),
            RendererTypes::Table => write!(f, "table"),
            RendererTypes::TransposedTable => write!(f, "transposed_table"),
        }
    }
}

impl ToSql<VarChar, Pg> for RendererTypes {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
        let value: String = match *self {
            RendererTypes::Area => "area".to_string(),
            RendererTypes::Bar => "bar".to_string(),
            RendererTypes::Bubble => "bubble".to_string(),
            RendererTypes::CustomList => "customList".to_string(),
            RendererTypes::Funnel => "funnel".to_string(),
            RendererTypes::Line => "line".to_string(),
            RendererTypes::Number => "number".to_string(),
            RendererTypes::Pie => "pie".to_string(),
            RendererTypes::Table => "table".to_string(),
            RendererTypes::TransposedTable => "transposed_table".to_string(),
        };
        let mut new_out = out.reborrow();
        ToSql::<VarChar, Pg>::to_sql(&value, &mut new_out)
    }
}

impl FromSql<VarChar, Pg> for RendererTypes {
    fn from_sql(bytes: PgValue<'_>) -> deserialize::Result<Self> {
        match String::from_sql(bytes)?.as_str() {
            "area" => Ok(RendererTypes::Area),
            "bar" => Ok(RendererTypes::Bar),
            "bubble" => Ok(RendererTypes::Bubble),
            "customList" => Ok(RendererTypes::CustomList),
            "custom_list" => Ok(RendererTypes::CustomList),
            "funnel" => Ok(RendererTypes::Funnel),
            "line" => Ok(RendererTypes::Line),
            "number" => Ok(RendererTypes::Number),
            "pie" => Ok(RendererTypes::Pie),
            "table" => Ok(RendererTypes::Table),
            "transposed_table" => Ok(RendererTypes::TransposedTable),
            _ => Err(format!(
                "Unrecognized enum value: {}",
                String::from_sql(bytes)?.as_str()
            )
            .into()),
        }
    }
}

#[derive(Queryable, Debug, Serialize, Deserialize, Changeset, View)]
#[id_data_type = "i64"]
pub struct Visualization {
    #[skip_in_changeset]
    pub id: i64,
    pub name: Option<String>,
    pub settings: Option<serde_json::Value>,
    pub query_terms: Option<serde_json::Value>,
    pub renderer_type: Option<RendererTypes>,
    pub question_id: Option<i64>,
    #[serde(skip_deserializing)]
    pub inserted_at: NaiveDateTime,
    #[serde(skip_deserializing)]
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug)]
pub struct WidgetItem {
    pub id: i64,
    pub text: Option<String>,
    pub config: Option<serde_json::Value>,
    pub value: Option<String>,
    pub widget_id: Option<i64>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

pub struct Widget {
    pub id: i64,
    pub column_name: String,
    pub name: String,
    pub renderer: Option<i32>,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Debug, Serialize, Deserialize, Changeset, View, QueryableByName)]
#[table_name = "bg_queue"]
#[id_data_type = "Uuid"]
pub struct BgJob {
    pub id: Uuid,
    pub inserted_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub scheduled_for: NaiveDateTime,
    pub failed_attempts: i32,
    pub status: JobStatus,
    pub message: serde_json::value::Value,
    pub name: Option<String>,
}

#[derive(
    Debug,
    PartialEq,
    FromSqlRow,
    AsExpression,
    Eq,
    Serialize,
    Deserialize,
    Clone,
    DatabaseEnum,
    Default,
)]
#[diesel(sql_type = Int4)]
#[serde(rename_all = "snake_case")]
pub enum JobStatus {
    #[default]
    Queued = 1,
    Running = 2,
    Failed = 3,
}
