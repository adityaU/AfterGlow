use actix_web::{error, web, HttpResponse, Responder};

use super::base;

use crate::repository::models::{Note, NoteChangeset, NoteView};

use crate::{controllers::common::ResponseData, repository::DBPool};

use std::sync::Arc;

use crate::errors::AGError;
use actix_web_grants::proc_macro::has_permissions;


base::generate_update!(update, Note, NoteChangeset, NoteView, "Dashboard.edit");
base::generate_create!(create, Note, NoteChangeset, NoteView, "Dashboard.edit");
base::generate_show!(show, Note, NoteView, "Dashboard.show");
