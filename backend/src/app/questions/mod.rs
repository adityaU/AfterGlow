use std::fmt::{self, Formatter};

use actix_web::HttpRequest;
use actix_web_grants::permissions::{AuthDetails};
use chrono::Utc;
use diesel::{result::Error, PgConnection};
use std::error::Error as StdError;


use serde_json::to_value;
use uuid::Uuid;

use crate::{
    controllers::{
        helpers::get_current_user_id,
        question::{ApiAction, QuestionPayload},
    },
    repository::{
        models::{
            ActionLevel, ApiAction as DBApiAction, ApiActionChangeset, Question, QuestionChangeset,
            SharedEntity, Tag, TagChangeset, TagQuestion, TagQuestionChangeset, Team, TeamShare,
            TeamShareChangeset, Variable as DBVariable, VariableChangeset,
            Visualization as DBVisualization, VisualizationChangeset,
        },
        permissions::PermissionNames,
    },
    views::question::QuestionShowView,
};

use self::config::{Variable, Visualization};

pub mod config;

pub fn create_api_action_changeset(api_action: &ApiAction, ques_id: i64) -> ApiActionChangeset {
    ApiActionChangeset {
        question_id: Some(ques_id),
        updated_at: Utc::now().naive_utc(),
        url: api_action.url.clone(),
        headers: api_action.headers.clone(),
        body: api_action.body.clone(),
        method: api_action.method.clone(),
        name: api_action.name.clone(),
        color: api_action.color.clone(),
        open_in_new_tab: api_action.open_in_new_tab,
        response_settings: api_action.response_settings.clone(),
        hidden: api_action.hidden,
        inserted_at: Utc::now().naive_utc(),
        column: api_action.column.clone(),
        on_success: api_action.on_success.clone(),
        on_failure: api_action.on_failure.clone(),
        failure_message: api_action.failure_message.clone(),
        failure_key: api_action.failure_key.clone(),
        success_message: api_action.success_message.clone(),
        success_key: api_action.success_key.clone(),
        action_level: Some(ActionLevel::Question),
        visualization_id: api_action.visualization_id,
        loading_message: api_action.loading_message.clone(),
        display_settings: api_action.display_settings.clone(),
        open_option: api_action.open_option.clone(),
    }
}

pub fn payload_to_create_changeset(qp: &QuestionPayload, req: HttpRequest) -> QuestionChangeset {
    QuestionChangeset {
        title: qp.title.clone().into(),
        last_updated: None,
        sql: qp.sql.clone().into(),
        human_sql: to_value(qp.human_sql.clone()).ok(),
        inserted_at: Utc::now().naive_utc(),
        updated_at: Utc::now().naive_utc(),
        query_type: qp.query_type.clone().into(),
        shareable_link: qp.shareable_link.or(Some(Uuid::new_v4())),
        is_shareable_link_public: Some(false),
        results_view_settings: None,
        columns_: None,
        cached_results: None,
        shared_to: qp.shared_to.clone(),
        owner_id: get_current_user_id(&req).into(),
        config: to_value(qp.config.clone()).ok(),
    }
}

pub fn payload_to_update_changeset(
    qp: &QuestionPayload,
    req: HttpRequest,
    question: &Question,
) -> QuestionChangeset {
    QuestionChangeset {
        title: qp.title.clone().into(),
        last_updated: None,
        sql: qp.sql.clone().into(),
        human_sql: to_value(qp.human_sql.clone())
            .ok()
            .or(question.human_sql.clone()),
        inserted_at: question.inserted_at,
        updated_at: Utc::now().naive_utc(),
        query_type: qp.query_type.clone().into(),
        shareable_link: qp.shareable_link,
        is_shareable_link_public: Some(false),
        results_view_settings: None,
        columns_: None,
        cached_results: None,
        shared_to: qp.shared_to.clone().or(question.shared_to.clone()),
        owner_id: get_current_user_id(&req).into(),
        config: to_value(qp.config.clone()).ok().or(question.config.clone()),
    }
}

pub fn create_variable_changeset(var: &Variable, question_id: i64) -> VariableChangeset {
    VariableChangeset {
        name: Some(var.name.clone()),
        inserted_at: Utc::now().naive_utc(),
        updated_at: Utc::now().naive_utc(),
        default: var.default.clone(),
        var_type: var.var_type.clone(),
        column_id: None,
        question_id: Some(question_id),
        dashboard_id: None,
        default_operator: None,
        question_filter_id: None,
        default_options: None,
    }
}

pub fn create_visualization_changeset(
    viz: &Visualization,
    question_id: i64,
) -> VisualizationChangeset {
    VisualizationChangeset {
        name: Some(viz.name.clone()),
        inserted_at: Utc::now().naive_utc(),
        updated_at: Utc::now().naive_utc(),
        settings: viz.settings.clone(),
        query_terms: to_value(viz.query_terms.clone()).ok(),
        renderer_type: viz.renderer_type.clone(),
        question_id: Some(question_id as i64),
    }
}

#[derive(Debug)]
pub enum QuestionCreateError {
    ErrorCreatingQuestion(String),
    ErrorUpdatingQuestion(String),
    ErrorGettingAfterglowConnection(String),
    ErrorCreatingVariable(String),
    ErrorUpdatingVisualization(String),
    ErrorCreatingVisualization(String),
    ErrorRunningTransaction(String),
    ErrorDeletingVariable(String),
    ErrorFindingQuestion(String),
}

impl fmt::Display for QuestionCreateError {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        match self {
            QuestionCreateError::ErrorRunningTransaction(msg) => {
                write!(f, "Error running transaction: {}", msg)
            }
            QuestionCreateError::ErrorCreatingQuestion(msg) => {
                write!(f, "Error creating question: {}", msg)
            }
            QuestionCreateError::ErrorUpdatingQuestion(msg) => {
                write!(f, "Error updating question: {}", msg)
            }
            QuestionCreateError::ErrorCreatingVariable(msg) => {
                write!(f, "Error creating variable: {}", msg)
            }
            QuestionCreateError::ErrorUpdatingVisualization(msg) => {
                write!(f, "Error updating visualization: {}", msg)
            }
            QuestionCreateError::ErrorCreatingVisualization(msg) => {
                write!(f, "Error creating visualization: {}", msg)
            }
            QuestionCreateError::ErrorGettingAfterglowConnection(msg) => {
                write!(f, "Error getting afterglow connection: {}", msg)
            } // Implement cases for other variants
            QuestionCreateError::ErrorDeletingVariable(msg) => {
                write!(f, "Error deleting variable: {}", msg)
            }
            QuestionCreateError::ErrorFindingQuestion(msg) => {
                write!(f, "Error finding question: {}", msg)
            }
        }
    }
}
impl std::error::Error for QuestionCreateError {}

impl From<Error> for QuestionCreateError {
    fn from(err: Error) -> Self {
        QuestionCreateError::ErrorRunningTransaction(err.to_string())
    }
}

pub fn delete(
    conn: &mut PgConnection,
    question_id: i64,
    _req: HttpRequest,
    _auth_details: AuthDetails<PermissionNames>,
) -> Result<(), Error> {
    DBApiAction::delete_all_by_question_id(conn, question_id)?;
    DBVariable::delete_by_question_id(conn, question_id)?;
    DBVisualization::delete_by_question_id(conn, question_id)?;
    TagQuestion::delete_by_question_id(conn, question_id)?;
    TeamShare::delete_question_shares_by_id(conn, question_id)?;
    Question::delete(conn, question_id)
}

pub fn save(
    conn: &mut PgConnection,
    qp: QuestionPayload,
    req: HttpRequest,
) -> Result<QuestionShowView, QuestionCreateError> {
    let question = conn
        .build_transaction()
        .run::<_, QuestionCreateError, _>(|conn| {
            let question = if qp.id.is_some() {
                let question = Question::find(conn, qp.id.unwrap())
                    .map_err(|e| QuestionCreateError::ErrorFindingQuestion(e.to_string()))?;
                let qc = payload_to_update_changeset(&qp, req, &question);
                let res = Question::update(conn, qp.id.unwrap(), qc)
                    .map_err(|e| QuestionCreateError::ErrorUpdatingQuestion(e.to_string()))?;
                sync_shares(conn, &qp, question.id)
                    .map_err(|e| QuestionCreateError::ErrorUpdatingQuestion(e.to_string()))?;
                res
            } else {
                let qc = payload_to_create_changeset(&qp, req);
                Question::create(conn, qc)
                    .map_err(|e| QuestionCreateError::ErrorCreatingQuestion(e.to_string()))?
            };

            DBVariable::delete_by_question_id(conn, question.id)
                .map_err(|e| QuestionCreateError::ErrorDeletingVariable(e.to_string()))?;

            if qp.api_action.is_some() {
                //save api_action
                let api_action = qp.api_action.unwrap();
                let api_action_changeset = create_api_action_changeset(&api_action, question.id);
                if api_action.id.is_some() {
                    DBApiAction::update(conn, api_action.id.unwrap(), api_action_changeset)
                        .map_err(|e| QuestionCreateError::ErrorCreatingQuestion(e.to_string()))?;
                } else {
                    DBApiAction::create(conn, api_action_changeset)
                        .map_err(|e| QuestionCreateError::ErrorCreatingQuestion(e.to_string()))?;
                }
            }
            for var in &qp.variables {
                let var = create_variable_changeset(var, question.id);
                DBVariable::create(conn, var)
                    .map_err(|e| QuestionCreateError::ErrorCreatingVariable(e.to_string()))?;
            }

            if let Some(tags) = &qp.tags {
                let new_tags = tags
                    .iter()
                    .map(|tag| tag.name.clone().unwrap_or("".to_string()))
                    .collect::<Vec<String>>();
                let extra_tags = Tag::find_by_question_id(conn, question.id)
                    .map_err(|e| QuestionCreateError::ErrorUpdatingQuestion(e.to_string()))?
                    .iter()
                    .filter(|tag| {
                        new_tags
                            .iter()
                            .position(|x| x.clone() == tag.name)
                            .is_none()
                    })
                    .map(|tag| tag.id)
                    .collect();

                TagQuestion::delete_by_tag_ids_and_question_id(conn, extra_tags, question.id)
                    .map_err(|e| QuestionCreateError::ErrorUpdatingQuestion(e.to_string()))?;

                for tag in tags {
                    if tag.name.clone() == Some("".to_string()) {
                        continue;
                    }

                    match &tag.name {
                        Some(_) => (),
                        None => continue,
                    }
                    if let Some(id) = tag.id {
                        TagQuestion::create_or_update(
                            conn,
                            &TagQuestionChangeset {
                                tag_id: Some(id),
                                question_id: Some(question.id),
                                inserted_at: Utc::now().naive_utc(),
                                updated_at: Utc::now().naive_utc(),
                            },
                        )
                        .map_err(|e| QuestionCreateError::ErrorUpdatingQuestion(e.to_string()))?;
                    } else {
                        Tag::create_question_tag(
                            conn,
                            TagChangeset {
                                name: tag.name.clone().unwrap(),
                                description: tag.description.clone(),
                                inserted_at: Utc::now().naive_utc(),
                                updated_at: Utc::now().naive_utc(),
                                color: tag.color.clone(),
                            },
                            question.id,
                        )
                        .map_err(|e| QuestionCreateError::ErrorUpdatingQuestion(e.to_string()))?;
                    }
                }
            }

            for viz in &qp.visualizations {
                let visualization = create_visualization_changeset(viz, question.id);
                if viz.id.is_some() {
                    DBVisualization::update(conn, viz.id.unwrap(), visualization).map_err(|e| {
                        QuestionCreateError::ErrorUpdatingVisualization(e.to_string())
                    })?;
                } else {
                    DBVisualization::create(conn, visualization).map_err(|e| {
                        QuestionCreateError::ErrorCreatingVisualization(e.to_string())
                    })?;
                }
            }
            Ok(question)
        })?;

    Ok(QuestionShowView::from_model(conn, &question))
}

fn sync_shares(
    conn: &mut PgConnection,
    qp: &QuestionPayload,
    question_id: i64,
) -> Result<(), Error> {
    TeamShare::find_names_by_shared_id(conn, question_id, SharedEntity::Question)
        .unwrap_or(vec![])
        .iter()
        .for_each(|team_name| {
            if !qp
                .shared_to
                .clone()
                .unwrap_or_else(Vec::new)
                .iter()
                .any(|item| {
                    item.clone().unwrap_or("".to_string()).trim_matches('"') == team_name.clone()
                })
            {
                if let Ok(team) = Team::find_by_name(conn, team_name.clone()) {
                    let team_id = team.id;
                    let _ = TeamShare::delete_shares_by_team_id_and_shared_id(
                        conn,
                        team_id,
                        question_id,
                        SharedEntity::Question,
                    );
                }
            }
        });
    qp.shared_to
        .clone()
        .unwrap_or_else(Vec::new)
        .iter()
        .filter_map(|item| match item {
            Some(s) if s.ends_with("@team") => Some(s.as_str().replace("@team", "")),
            _ => None,
        })
        .for_each(|team_name| {
            if let Ok(team) =
                Team::find_by_name(conn, team_name.clone().trim_matches('"').to_string())
            {
                let team_id = team.id;
                let _ = TeamShare::create_or_update(
                    conn,
                    TeamShareChangeset {
                        team_id,
                        shared_id: question_id,
                        shared_entity: SharedEntity::Question,
                        inserted_at: Utc::now().naive_utc(),
                        updated_at: Utc::now().naive_utc(),
                    },
                );
            }
        });

    Ok(())
}
