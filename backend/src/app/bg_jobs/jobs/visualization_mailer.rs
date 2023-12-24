use std::{fmt, sync::Arc};

use askama::Template;
use fancy_regex::Regex;
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};

use crate::{
    app::{
        bg_jobs::{
            jobs::send_csv::{SendCSVJob, PREVIEW_LIMIT},
            Error as BGJobError, JobEssentials, LongLivedData,
        },
        questions::config::QuestionHumanSql,
        visualizations::{
            viz,
        },
    },
    repository::models::User,
};

use super::send_csv::CSVMailTemplate;

lazy_static! {
    static ref RE: Regex = Regex::new(r"\{\{download_link:(.*?)\}\}").unwrap();
}

#[derive(Debug, Serialize, Deserialize)]
pub enum VisualizationMailerError {
    NoSystemUser(String),
    UnableToMakeDefaultPayload(String),
}

#[derive(Template)] // this will generate the code...
#[template(path = "csv_link.html")] // using the template in this path, relative
struct CSVLinkTemplate {
    url: String,
    url_text: String,
}

impl fmt::Display for VisualizationMailerError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            VisualizationMailerError::NoSystemUser(msg) => {
                write!(f, "No system user found: {}", msg)
            }
            VisualizationMailerError::UnableToMakeDefaultPayload(msg) => {
                write!(f, "Unable to make default payload: {}", msg)
            }
        }
    }
}

impl std::error::Error for VisualizationMailerError {}
impl From<VisualizationMailerError> for BGJobError {
    fn from(visualization_mailer_error: VisualizationMailerError) -> Self {
        BGJobError::ScheduledVisualizationMailerError(visualization_mailer_error)
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct VisualizationMailerJob {
    pub recipients: Vec<String>,
    pub visualization_id: i64,
    pub email_content: Option<String>,
    pub subject: String,
}

#[async_trait::async_trait]
impl JobEssentials for VisualizationMailerJob {
    async fn execute(&self, data: Arc<LongLivedData>) -> Result<(), BGJobError> {
        let user_id = User::system_user(&mut data.pool.get().unwrap())
            .map_err(|err| VisualizationMailerError::NoSystemUser(err.to_string()))?
            .id;

        let conn = data.pool.get();

        let payload = viz::make_question_config(
            &mut conn.unwrap(),
            self.visualization_id,
            QuestionHumanSql {
                api_action: None,
                database: None,
                filters: None,
                groupings: None,
                sortings: None,
                table: None,
                views: None,
                limit: None,
                offset: None,
                query_type: None,
                raw_query: None,
                variables: None,
                visualization: None,
            },
        )
        .map_err(|err| VisualizationMailerError::UnableToMakeDefaultPayload(err.to_string()))?;
        let (renderer, config) = SendCSVJob::fetch_renderer_and_config(&payload);
        let (url, columns, preview_data, smtp_conf) = SendCSVJob::get_csv_download_attributes(
            payload.clone(),
            user_id,
            0,
            data,
            PREVIEW_LIMIT,
            renderer,
            config,
        )
        .await?;
        // remove hidden_columns from columns and corresponding index from preview data
        SendCSVJob::send_mail(
            self.recipients
                .clone()
                .iter()
                .map(|email| email.as_str())
                .collect::<Vec<&str>>(),
            self.subject.as_str(),
            Self::text(url.clone()),
            self.html(url, columns, preview_data),
            smtp_conf,
        )
        .await?;

        Ok(())
    }
}

impl VisualizationMailerJob {
    fn text(url: String) -> String {
        format!("Please download your CSV from the following link: {}", url)
    }
    fn html(&self, url: String, _columns: Arc<Vec<String>>, preview_html: String) -> String {
        let default_email = CSVMailTemplate {
            preview_html: preview_html.clone(),
            url: url.clone(),
        }
        .render()
        .unwrap();
        if self.email_content.is_none() {
            return default_email;
        }

        let mut email_content = self.email_content.clone().unwrap();

        if email_content == "" {
            return default_email;
        }
        email_content = email_content.replace("{{preview_data}}", preview_html.as_str());
        let captures = RE.captures(email_content.as_str());
        if captures.is_err() {
            return email_content;
        }
        if let Some(caps) = captures.unwrap() {
            if let Some(url_name) = caps.get(1) {
                email_content = email_content.replace(
                    caps.get(0).unwrap().as_str(),
                    CSVLinkTemplate {
                        url,
                        url_text: url_name.as_str().to_string(),
                    }
                    .render()
                    .unwrap()
                    .as_str(),
                );
            }
        }
        email_content
    }
}
