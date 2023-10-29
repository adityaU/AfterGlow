use diesel::PgConnection;

use crate::{
    app::questions::config::{self, QuestionConfig},
    repository::models::{ApiAction, Question, Visualization},
};

pub fn make_question_config(
    conn: &mut PgConnection,
    viz_id: i64,
    payload: config::QuestionConfig,
) -> Result<config::QuestionConfig, String> {
    let viz = crate::repository::models::Visualization::find(conn, viz_id).map_err(|e| {
        format!(
            "Error finding visualization with id :{}, Error:  {}",
            viz_id,
            e.to_string()
        )
    })?;

    let question_id = get_question_id_from_viz(&viz)?;

    let question = Question::find(conn, question_id).map_err(|e| {
        format!(
            "Error finding Question with id : {}, Error: {}",
            viz_id,
            e.to_string()
        )
    })?;

    let mut config: config::QuestionConfig =
        serde_json::from_value(question.human_sql.clone().unwrap_or_default()).map_err(|e| {
            format!(
                "Error decoding QuestionConfig from question id: {}, Error: {}, config: {:?}",
                question_id, e, &question.human_sql
            )
        })?;

    let viz_query_terms: config::QueryTermDetails =
        serde_json::from_value::<config::QueryTermDetails>(viz.query_terms.unwrap_or_default())
            .map_err(|e| {
                format!(
                    "Error decoding visualization QueryTerms from visualization id: {}, Error: {}",
                    viz_id, e
                )
            })?;

    config.visualization = Some(config::Visualization {
        id: Some(viz_id),
        name: viz.name.unwrap_or_default().to_string(),
        question_id: Some(question_id),
        query_terms: viz_query_terms,
    });

    if config
        .database
        .as_ref()
        .unwrap_or(&config::Database::default())
        .db_type
        .as_str()
        == "api_client"
    {
        let api_action = ApiAction::find_direct_actions_by_question_id(conn, question_id as i32)
            .map_err(|e| {
                format!(
                    "Error finding ApiAction for Question id : {}, Error: {}",
                    question_id,
                    e.to_string()
                )
            })?;
        config.api_action = Some(api_action);
    }

    Ok(config::QuestionConfig {
        api_action: payload.api_action.or(config.api_action),
        database: payload.database.or(config.database),
        filters: payload.filters.or(config.filters),
        groupings: payload.groupings.or(config.groupings),
        sortings: payload.sortings.or(config.sortings),
        table: payload.table.or(config.table),
        views: payload.views.or(config.views),
        limit: payload.limit.or(config.limit),
        offset: payload.offset.or(config.offset),
        query_type: payload.query_type.or(config.query_type),
        raw_query: payload.raw_query.or(config.raw_query),
        variables: payload.variables.or(config.variables),
        visualization: payload.visualization.or(config.visualization),
    })
}

fn get_question_id_from_viz(viz: &Visualization) -> Result<i32, String> {
    match viz.question_id {
        Some(v) => Ok(v as i32),
        None => return Err(format!("visualization has no question id : {}", viz.id))?,
    }
}
