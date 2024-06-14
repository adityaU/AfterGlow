use diesel::{PgConnection, RunQueryDsl};

use serde_json::to_value;


use chrono::Utc;

use diesel::prelude::*;
use diesel::result::Error;

use crate::app::results::AuditDetails;



use super::models::AuditAction;
use super::models::{AuditLog, AuditLogChangeset};
use super::schema::audit_logs;

const MAX_FAILED_ATTEMPTS: i16 = 5;

impl AuditLog {
    pub fn log_query_action(
        conn: &mut PgConnection,
        user_id: i64,
        audit_details: AuditDetails,
    ) -> Result<(), Error> {
        let new_log = AuditLogChangeset {
            whodunit: Some(user_id as i32),
            action: Some(AuditAction::Query),
            additional_data: Some(to_value(audit_details).unwrap_or_default()),
            inserted_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
        };
        diesel::insert_into(audit_logs::table)
            .values(&new_log)
            .execute(conn)?;
        Ok(())
    }
    pub fn log_download_action(
        conn: &mut PgConnection,
        user_id: i64,
        audit_details: AuditDetails,
    ) -> Result<(), Error> {
        let new_log = AuditLogChangeset {
            whodunit: Some(user_id as i32),
            action: Some(AuditAction::Download),
            additional_data: Some(to_value(audit_details).unwrap_or_default()),
            inserted_at: Utc::now().naive_utc(),
            updated_at: Utc::now().naive_utc(),
        };
        diesel::insert_into(audit_logs::table)
            .values(&new_log)
            .execute(conn)?;
        Ok(())
    }
}
