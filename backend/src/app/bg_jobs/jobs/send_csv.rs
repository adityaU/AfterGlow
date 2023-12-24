use std::fmt::{self};
use std::{path::Path, sync::Arc, time::Duration};

use aws_sdk_s3::{
    config::{Credentials, Region},
    presigning::{PresignedRequest, PresigningConfig},
    primitives::ByteStream,
    Client,
};

use diesel::PgConnection;
use lettre::message::{header, Mailboxes};
use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::app::visualizations::renderer_config::{RendererConfig, Table};
use crate::app::{
    bg_jobs::{Error as BGJobError, JobEssentials, LongLivedData},
    questions::config::QuestionHumanSql,
    results::{self, query_builders::postgres::DBValue},
    settings::{
        reports::{get_smtp_config, SMTPConfig},
        s3_config,
    },
};
use crate::repository::models::RendererTypes;

use lettre::{
    message::Mailbox,
    transport::smtp::{authentication::Credentials as SMTPCredentials, client::TlsParameters},
    Tokio1Executor,
};
use lettre::{
    message::{MultiPart, SinglePart},
    transport::smtp::client::Tls,
};
use lettre::{AsyncSmtpTransport, AsyncTransport, Message};

pub const PREVIEW_LIMIT: usize = 50;

use askama::Template;

//
#[derive(Debug, Serialize, Deserialize)]
pub enum SendCSVError {
    CanNotMakeCSVFromApiResponse,
    ErrorWritingCSV(String),
    ErrorFetchingResults(String),
    UnableToReadS3Config(String),
    CouldNotReadCSVFile(String),
    ErrorConfiguringPresignedExpiry(String),
    CouldNotUploadToS3(String),
    CouldNotParseFromEmail(String),
    CouldNotParseToEmail(String),
    CouldNotSendEmail(String),
    CouldNotCreateSMTPRelay(String),
    CouldNotCreateSMTPCredentials(String),
    CouldNotBuildTLSParams(String),
    CouldNotBuildEmailMessage(String),
    CouldNotFetchSMTPConfig(String),
}

impl fmt::Display for SendCSVError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            SendCSVError::CanNotMakeCSVFromApiResponse => {
                write!(f, "Can not make CSV from api response")
            }
            SendCSVError::ErrorWritingCSV(msg) => write!(f, "Error Writing CSV: {}", msg),
            SendCSVError::ErrorFetchingResults(msg) => write!(f, "Error Fetching Results: {}", msg),
            SendCSVError::UnableToReadS3Config(msg) => {
                write!(f, "Unable to read S3 Config: {}", msg)
            }
            SendCSVError::CouldNotReadCSVFile(msg) => write!(f, "Could not read CSV File: {}", msg),
            SendCSVError::ErrorConfiguringPresignedExpiry(msg) => {
                write!(f, "Error Configuring Presigned Expiry: {}", msg)
            }
            SendCSVError::CouldNotUploadToS3(msg) => write!(f, "Could not upload to S3: {}", msg),
            SendCSVError::CouldNotParseFromEmail(msg) => {
                write!(f, "Could not parse from email: {}", msg)
            }
            SendCSVError::CouldNotParseToEmail(msg) => {
                write!(f, "Could not parse to email: {}", msg)
            }
            SendCSVError::CouldNotSendEmail(msg) => write!(f, "Could not send email: {}", msg),
            SendCSVError::CouldNotCreateSMTPRelay(msg) => {
                write!(f, "Could not create SMTP relay: {}", msg)
            }
            SendCSVError::CouldNotCreateSMTPCredentials(msg) => {
                write!(f, "Could not create SMTP credentials: {}", msg)
            }
            SendCSVError::CouldNotBuildTLSParams(msg) => {
                write!(f, "Could not build TLS params: {}", msg)
            }
            SendCSVError::CouldNotBuildEmailMessage(msg) => {
                write!(f, "Could not build email message: {}", msg)
            }
            SendCSVError::CouldNotFetchSMTPConfig(msg) => {
                write!(f, "Could not fetch SMTP config: {}", msg)
            }
        }
    }
}

impl std::error::Error for SendCSVError {}
impl From<SendCSVError> for BGJobError {
    fn from(send_csv_error: SendCSVError) -> Self {
        BGJobError::SendCSVError(send_csv_error)
    }
}

#[derive(Template)] // this will generate the code...
#[template(path = "csv_mail.html")] // using the template in this path, relative
pub struct CSVMailTemplate {
    pub preview_html: String,
    pub url: String,
}

#[derive(Template)] // this will generate the code...
#[template(path = "preview_data.html")] // using the template in this path, relative
struct PreviewDataTemplate<'a> {
    columns: &'a Vec<String>,
    rows: Vec<Vec<String>>,
}

#[derive(Template)] // this will generate the code...
#[template(path = "chart.html")] // using the template in this path, relative
struct ChartTemplate {
    renderer: RendererTypes,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SendCSVJob {
    pub email: String,
    pub payload: QuestionHumanSql,
    pub user_id: i32,
    pub org_id: i64,
}

#[async_trait::async_trait]
impl JobEssentials for SendCSVJob {
    async fn execute(&self, data: Arc<LongLivedData>) -> Result<(), BGJobError> {
        println!("SendCSVJob: {:?}", &self);
        let user_id = self.user_id;
        let org_id = self.org_id;
        let (renderer, config) = Self::fetch_renderer_and_config(&self.payload);
        let (url, _columns, preview_html, smtp_conf) = Self::get_csv_download_attributes(
            self.payload.clone(),
            user_id,
            org_id,
            data,
            PREVIEW_LIMIT,
            renderer,
            config,
        )
        .await?;
        Self::send_mail(
            vec![self.email.clone().as_str()],
            "Please Download your CSV",
            Self::text(url.clone()),
            Self::html(url, preview_html),
            smtp_conf,
        )
        .await?;

        Ok(())
    }
}

impl SendCSVJob {
    pub fn fetch_renderer_and_config(payload: &QuestionHumanSql) -> (RendererTypes, Option<Value>) {
        match payload.visualization.clone() {
            Some(viz) => (viz.renderer_type.unwrap_or_default(), viz.settings),
            None => (RendererTypes::default(), None),
        }
    }
    pub fn remove_hidden_columns(
        columns: &mut Arc<Vec<String>>,
        hidden_columns: &Vec<String>,
        rows: &mut Arc<Vec<Vec<DBValue>>>,
    ) {
        let columns = Arc::make_mut(columns);
        let rows = Arc::make_mut(rows);
        // Find the indices of hidden_columns in columns
        let hidden_indices: Vec<usize> = columns
            .iter()
            .enumerate()
            .filter_map(|(i, col)| {
                if hidden_columns.contains(col) {
                    Some(i)
                } else {
                    None
                }
            })
            .collect();

        // Remove the elements at hidden_indices from each row in rows
        for row in rows.iter_mut() {
            for &index in hidden_indices.iter().rev() {
                if index < row.len() {
                    row.remove(index);
                }
            }
        }

        // Remove hidden_columns from columns
        columns.retain(|col| !hidden_columns.contains(col));
    }
    pub async fn get_csv_download_attributes(
        payload: QuestionHumanSql,
        user_id: i32,
        org_id: i64,
        data: Arc<LongLivedData>,
        preview_limit: usize,
        renderer: RendererTypes,
        config: Option<Value>,
    ) -> Result<(String, Arc<Vec<String>>, String, SMTPConfig), SendCSVError> {
        let conn = data.pool.clone().get();
        let mut connection = conn.unwrap();
        let (url, columns, preview_data) = {
            let response = results::fetch(
                &mut connection,
                payload.clone(),
                &data.conn_pools.clone(),
                user_id,
                org_id,
            )
            .await
            .map_err(|err| SendCSVError::ErrorFetchingResults(err.to_string()))?;
            use results::ResultsResponse::*;
            match response.0 {
                ApiResponse(_) => return Err(SendCSVError::CanNotMakeCSVFromApiResponse.into()),
                QueryResponse(resp) => {
                    let mut rows = resp.rows;
                    let mut columns = resp.columns;
                    let hidden_columns = Self::hidden_columns(config, renderer.clone());
                    Self::remove_hidden_columns(&mut columns, &hidden_columns, &mut rows);
                    let (file_path, key) = SendCSVJob::write_csv(columns.clone(), rows.clone())?;
                    let conn = data.pool.clone().get();
                    let mut connection = conn.unwrap();
                    let url = SendCSVJob::write_file_to_s3(&mut connection, file_path, key).await?;
                    let preview_data = SendCSVJob::get_first_n_rows(rows.clone(), preview_limit);
                    (url, columns, preview_data)
                }
            }
        };

        let conn = data.pool.clone().get();
        let mut connection = conn.unwrap();
        let smtp_conf = get_smtp_config(&mut connection)
            .map_err(|err| SendCSVError::CouldNotFetchSMTPConfig(err.to_string()))?;
        let preview_html = Self::make_preview_html(renderer, columns.clone(), preview_data.clone());
        Ok((url, columns, preview_html, smtp_conf))
    }

    fn make_preview_html(
        renderer: RendererTypes,
        columns: Arc<Vec<String>>,
        preview_data: Vec<Vec<String>>,
    ) -> String {
        match renderer {
            RendererTypes::Table => PreviewDataTemplate {
                columns: &*columns,
                rows: preview_data,
            }
            .render()
            .unwrap(),
            _ => ChartTemplate { renderer }.render().unwrap(),
        }
    }

    fn hidden_columns(config: Option<Value>, renderer: RendererTypes) -> Vec<String> {
        if renderer != RendererTypes::Table {
            return vec![];
        }
        let config: Result<RendererConfig, _> = serde_json::from_value(config.unwrap_or_default());
        let tc = match config {
            Ok(rc) => rc.table.unwrap_or_default(),
            Err(_) => Table::default(),
        };
        tc.columns
            .iter()
            .filter(|c| !c.show)
            .map(|c| c.name.clone())
            .collect::<Vec<String>>()
    }
    fn get_first_n_rows(rows: Arc<Vec<Vec<DBValue>>>, n: usize) -> Vec<Vec<String>> {
        if rows.len() < n {
            return Self::convert_row_el_to_string(&rows);
        }

        let rows = &rows[0..n];

        Self::convert_row_el_to_string(rows)
    }

    fn convert_row_el_to_string(rows: &[Vec<DBValue>]) -> Vec<Vec<String>> {
        rows.iter()
            .map(|r| {
                r.iter()
                    .map(|v| Self::truncated(v.to_string()))
                    .collect::<Vec<_>>()
            })
            .collect::<Vec<_>>()
    }
    fn write_csv(
        columns: Arc<Vec<String>>,
        rows: Arc<Vec<Vec<DBValue>>>,
    ) -> Result<(String, String), SendCSVError> {
        let file_name = format!("{}{}", uuid::Uuid::new_v4(), ".csv");
        let file_key = format!("{}{}", "afterglow/downloads/", file_name);
        let file_path = format!("{}{}", "/tmp/".to_string(), file_name);
        let mut wtr = csv::Writer::from_path(&file_path)
            .map_err(|err| SendCSVError::ErrorWritingCSV(err.to_string()))?;

        let columns = columns.iter().map(|c| c.as_str()).collect::<Vec<_>>();
        wtr.write_record(&columns)
            .map_err(|err| SendCSVError::ErrorWritingCSV(err.to_string()))?;
        for row in &*rows {
            let row = row.iter().map(|v| v.to_string()).collect::<Vec<_>>();
            let row = row.iter().map(|v| v.as_str()).collect::<Vec<_>>();
            wtr.write_record(&row)
                .map_err(|err| SendCSVError::ErrorWritingCSV(err.to_string()))?;
        }

        wtr.flush()
            .map_err(|err| SendCSVError::ErrorWritingCSV(err.to_string()))?;

        Ok((file_path, file_key))
    }

    async fn write_file_to_s3(
        conn: &mut PgConnection,
        file_path: String,
        key: String,
    ) -> Result<String, SendCSVError> {
        let (s3_config, client) = Self::get_s3_client(conn).await?;

        Self::upload_file_to_s3(file_path, &client, &s3_config, &key).await?;
        Self::get_url(client, s3_config, key).await
    }

    async fn get_url(
        client: Client,
        s3_config: s3_config::S3Config,
        key: String,
    ) -> Result<String, SendCSVError> {
        let expires_in = Duration::from_secs(600);
        let presigned_request: PresignedRequest =
            client
                .get_object()
                .bucket(s3_config.bucket)
                .key(key)
                .presigned(PresigningConfig::expires_in(expires_in).map_err(|err| {
                    SendCSVError::ErrorConfiguringPresignedExpiry(err.to_string())
                })?)
                .await
                .map_err(|err| SendCSVError::CouldNotUploadToS3(err.to_string()))?;

        println!("presigned_request: {:?}", presigned_request);
        Ok(presigned_request.uri().to_string())
    }

    async fn upload_file_to_s3(
        file_path: String,
        client: &Client,
        s3_config: &s3_config::S3Config,
        key: &String,
    ) -> Result<(), SendCSVError> {
        let body = ByteStream::from_path(Path::new(file_path.as_str())).await;
        client
            .put_object()
            .bucket(s3_config.bucket.clone())
            .key(key.clone())
            .body(body.unwrap())
            .send()
            .await
            .map_err(|err| SendCSVError::CouldNotUploadToS3(err.to_string()))?;
        Ok(())
    }

    async fn get_s3_client(
        conn: &mut PgConnection,
    ) -> Result<(s3_config::S3Config, Client), SendCSVError> {
        let s3_config = s3_config::get(conn)
            .map_err(|err| SendCSVError::UnableToReadS3Config(err.to_string()))?;
        let credentials = Credentials::new(
            s3_config.key.clone(),
            s3_config.secret.clone(),
            None,
            None,
            "S3 Credentials",
        );
        let config = aws_config::from_env()
            .credentials_provider(credentials)
            .region(Region::new(s3_config.region.clone()))
            .load()
            .await;
        let client = Client::new(&config);
        Ok((s3_config, client))
    }

    fn html(url: String, preview_html: String) -> String {
        CSVMailTemplate { preview_html, url }.render().unwrap()
    }

    fn truncated(text: String) -> String {
        if text.len() > 255 {
            return text.chars().take(255).collect::<String>() + "...";
        }
        text
    }

    fn text(url: String) -> String {
        format!(
            r#"
Hi There 👋,
We've cooked up something special for you! 🎨 Your data is ready and waiting for you to dive in and explore.

👇 Click the link below to download your CSV file:
{}
"#,
            url
        )
    }

    pub async fn send_mail(
        to_emails: Vec<&str>,
        subject: &str,
        plain_text_body: String,
        html_body: String,
        smtp_conf: SMTPConfig,
    ) -> Result<(), SendCSVError> {
        let mailboxes: header::To = to_emails
            .join(",")
            .parse::<Mailboxes>()
            .map_err(|err| SendCSVError::CouldNotParseToEmail(err.to_string()))?
            .into();

        let email = Message::builder()
            .from(
                smtp_conf
                    .sender_email
                    .parse::<Mailbox>()
                    .map_err(|err| SendCSVError::CouldNotParseFromEmail(err.to_string()))?,
            )
            .mailbox(mailboxes)
            .subject(subject)
            .multipart(
                MultiPart::alternative()
                    .singlepart(SinglePart::plain(plain_text_body.to_string()))
                    .singlepart(SinglePart::html(html_body.to_string())),
            )
            .map_err(|err| SendCSVError::CouldNotBuildEmailMessage(err.to_string()))?;

        let tls = TlsParameters::builder(smtp_conf.host.clone())
            .build()
            .map_err(|err| SendCSVError::CouldNotBuildTLSParams(err.to_string()))?;

        let mailer = AsyncSmtpTransport::<Tokio1Executor>::relay(smtp_conf.host.as_str())
            .map_err(|err| SendCSVError::CouldNotCreateSMTPRelay(err.to_string()))?
            .tls(Tls::Required(tls))
            .port(smtp_conf.port)
            .credentials(SMTPCredentials::new(smtp_conf.username, smtp_conf.password))
            .build();

        let is_sent = mailer
            .send(email)
            .await
            .map_err(|err| SendCSVError::CouldNotSendEmail(err.to_string()))?;

        println!("is_sent: {:?}", is_sent);

        Ok(())
    }
}
