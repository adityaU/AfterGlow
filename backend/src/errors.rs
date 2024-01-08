use core::fmt;
use std::fmt::Display;

use actix_web::error;
use actix_web::http::StatusCode;
use serde::{Serialize, Serializer};

use crate::app::results::QueryError;

#[derive(Serialize)]
pub struct AGError<T> {
    error: String,
    details: Option<T>,
    #[serde(serialize_with = "serialize_status_code")]
    status: StatusCode,
}

fn serialize_status_code<S>(status_code: &StatusCode, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    serializer.serialize_u16(status_code.as_u16())
}

impl<T: Display> AGError<T> {
    pub fn new<W: Display>(error: W) -> Self {
        AGError {
            error: error.to_string(),
            details: None,
            status: StatusCode::BAD_REQUEST,
        }
    }
    pub fn new_with_details<W: Display>(error: W, details: Option<T>, status: StatusCode) -> Self {
        AGError {
            error: error.to_string(),
            details,
            status,
        }
    }
}

impl<T: Display + fmt::Debug + serde::Serialize> error::ResponseError for AGError<T> {
    fn error_response(&self) -> actix_web::HttpResponse {
        actix_web::HttpResponse::BadRequest().json(self)
    }

    fn status_code(&self) -> StatusCode {
        self.status
    }
}

impl<T: Display> fmt::Display for AGError<T> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.error)
    }
}

impl<T: Display + fmt::Debug> fmt::Debug for AGError<T> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("AGError")
            .field("error", &self.error)
            .field("details", &self.details)
            .field("status", &self.status)
            .finish()
    }
}

impl error::ResponseError for QueryError {
    fn error_response(&self) -> actix_web::HttpResponse {
        actix_web::HttpResponse::BadRequest().json(self)
    }

    fn status_code(&self) -> StatusCode {
        StatusCode::BAD_REQUEST
    }
}
impl From<String> for QueryError {
    fn from(error: String) -> Self {
        QueryError::new(error, "".to_string())
    }
}
