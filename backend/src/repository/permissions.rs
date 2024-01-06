use chrono::Utc;
use std::str::FromStr;
use strum::EnumIter;

use super::models::{Permission, PermissionChangeset};
use super::schema::permissions;

use diesel::deserialize::{self, FromSql, FromSqlRow};
use diesel::expression::AsExpression;
use diesel::pg::{Pg, PgValue};
use diesel::result::Error;
use diesel::serialize::{self, Output, ToSql};
use diesel::sql_types::VarChar;
use diesel::{expression_methods::ExpressionMethods, PgConnection, QueryDsl, RunQueryDsl};
use serde::{Deserialize, Deserializer, Serialize, Serializer};

#[derive(Debug, PartialEq, FromSqlRow, AsExpression, Eq, Clone, Default, EnumIter)]
#[diesel(sql_type = VarChar)]
pub enum PermissionNames {
    #[default]
    Any,
    DashboardShow,
    QuestionShow,
    DashboardEdit,
    DashboardCreate,
    DashboardDelete,
    QuestionEdit,
    QuestionCreate,
    QuestionDelete,
    SettingsAll,
}

pub const ADMIN_PERMISSIONS: &[PermissionNames] = &[
    PermissionNames::DashboardShow,
    PermissionNames::QuestionShow,
    PermissionNames::DashboardEdit,
    PermissionNames::DashboardCreate,
    PermissionNames::DashboardDelete,
    PermissionNames::QuestionEdit,
    PermissionNames::QuestionCreate,
    PermissionNames::QuestionDelete,
    PermissionNames::SettingsAll,
];

pub const VIEWER_PERMISSIONS: &[PermissionNames] = &[
    PermissionNames::DashboardShow,
    PermissionNames::QuestionShow,
];

pub const EDITOR_PERMISSIONS: &[PermissionNames] = &[
    PermissionNames::DashboardShow,
    PermissionNames::QuestionShow,
    PermissionNames::DashboardEdit,
    PermissionNames::DashboardCreate,
    PermissionNames::DashboardDelete,
    PermissionNames::QuestionEdit,
    PermissionNames::QuestionCreate,
    PermissionNames::QuestionDelete,
];

impl ToSql<VarChar, Pg> for PermissionNames {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
        let value: String = match *self {
            PermissionNames::DashboardShow => "Dashboard.show".to_string(),
            PermissionNames::QuestionShow => "Question.show".to_string(),
            PermissionNames::DashboardEdit => "Dashboard.edit".to_string(),
            PermissionNames::DashboardCreate => "Dashboard.create".to_string(),
            PermissionNames::DashboardDelete => "Dashboard.delete".to_string(),
            PermissionNames::QuestionEdit => "Question.edit".to_string(),
            PermissionNames::QuestionCreate => "Question.create".to_string(),
            PermissionNames::QuestionDelete => "Question.delete".to_string(),
            PermissionNames::SettingsAll => "Settings.all".to_string(),
            PermissionNames::Any => "Any".to_string(),
        };
        let mut new_out = out.reborrow();
        ToSql::<VarChar, Pg>::to_sql(&value, &mut new_out)
    }
}

impl FromSql<VarChar, Pg> for PermissionNames {
    fn from_sql(bytes: PgValue<'_>) -> deserialize::Result<Self> {
        match String::from_sql(bytes)?.as_str() {
            "Dashboard.show" => Ok(PermissionNames::DashboardShow),
            "Question.show" => Ok(PermissionNames::QuestionShow),
            "Dashboard.edit" => Ok(PermissionNames::DashboardEdit),
            "Dashboard.create" => Ok(PermissionNames::DashboardCreate),
            "Dashboard.delete" => Ok(PermissionNames::DashboardDelete),
            "Question.edit" => Ok(PermissionNames::QuestionEdit),
            "Question.create" => Ok(PermissionNames::QuestionCreate),
            "Question.delete" => Ok(PermissionNames::QuestionDelete),
            "Settings.all" => Ok(PermissionNames::SettingsAll),
            "Any" => Ok(PermissionNames::Any),
            _ => Err(format!(
                "Unrecognized enum value: {}",
                String::from_sql(bytes)?.as_str()
            )
            .into()),
        }
    }
}

impl FromStr for PermissionNames {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "Any" => Ok(PermissionNames::Any),
            "Dashboard.show" => Ok(PermissionNames::DashboardShow),
            "Question.show" => Ok(PermissionNames::QuestionShow),
            "Dashboard.edit" => Ok(PermissionNames::DashboardEdit),
            "Dashboard.create" => Ok(PermissionNames::DashboardCreate),
            "Dashboard.delete" => Ok(PermissionNames::DashboardDelete),
            "Question.edit" => Ok(PermissionNames::QuestionEdit),
            "Question.create" => Ok(PermissionNames::QuestionCreate),
            "Question.delete" => Ok(PermissionNames::QuestionDelete),
            "Settings.all" => Ok(PermissionNames::SettingsAll),
            _ => Err("invalid permission name".into()),
        }
    }
}

impl<'de> Deserialize<'de> for PermissionNames {
    fn deserialize<D>(deserializer: D) -> Result<PermissionNames, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        PermissionNames::from_str(&s).map_err(serde::de::Error::custom)
    }
}

impl Serialize for PermissionNames {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        match self {
            PermissionNames::Any => serializer.serialize_str("Any"),
            PermissionNames::DashboardShow => serializer.serialize_str("Dashboard.show"),
            PermissionNames::QuestionShow => serializer.serialize_str("Question.show"),
            PermissionNames::DashboardEdit => serializer.serialize_str("Dashboard.edit"),
            PermissionNames::DashboardCreate => serializer.serialize_str("Dashboard.create"),
            PermissionNames::DashboardDelete => serializer.serialize_str("Dashboard.delete"),
            PermissionNames::QuestionEdit => serializer.serialize_str("Question.edit"),
            PermissionNames::QuestionCreate => serializer.serialize_str("Question.create"),
            PermissionNames::QuestionDelete => serializer.serialize_str("Question.delete"),
            PermissionNames::SettingsAll => serializer.serialize_str("Settings.all"),
        }
    }
}

impl Permission {
    pub fn find_or_create(
        conn: &mut PgConnection,
        name: &PermissionNames,
        ps_id: i64,
    ) -> Result<Self, Error> {
        permissions::table
            .filter(permissions::name.eq(name))
            .filter(permissions::permission_set_id.eq(ps_id))
            .first::<Self>(conn)
            .or_else(|_| {
                let now = Utc::now().naive_utc();
                let changeset = PermissionChangeset {
                    permission_set_id: Some(ps_id),
                    name: Some(name.clone()),
                    inserted_at: now,
                    updated_at: now,
                };
                diesel::insert_into(permissions::table)
                    .values(changeset)
                    .get_result::<Self>(conn)
            })
    }
}
