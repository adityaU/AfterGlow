use crate::app::settings::gen_ai::GenAIConfiguration;

use super::GenAIClientProvider;

use diesel::PgConnection;
use serde::Deserialize;
use serde::Serialize;
use serde_json::Value;

const MAX_TOKENS: i64 = 4096;

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Roles {
    #[default]
    User,
    System,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct Payload {
    pub model: String,
    pub max_tokens: i64,
    pub system: String,
    pub messages: Vec<Message>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct Message {
    pub role: Roles,
    pub content: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct Response {
    content: Vec<ContentDetails>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct ContentDetails {
    pub text: String,
    #[serde(rename = "type")]
    pub type_: String,
}

pub struct Client {
    client: reqwest::Client,
    config: GenAIConfiguration,
}

impl Client {
    pub fn new(
        _conn: &mut PgConnection,
        config: GenAIConfiguration,
        _user_id: i64,
        _org_id: i64,
    ) -> Self {
        let client = reqwest::Client::new();
        Self { client, config }
    }
}

#[async_trait::async_trait]
impl GenAIClientProvider for Client {
    async fn request(&self, query: String, system_prompt: String) -> Result<String, String> {
        let payload = Payload {
            model: self.config.model.clone(),
            max_tokens: MAX_TOKENS,
            system: system_prompt.to_string(),
            messages: vec![Message {
                role: Roles::User,
                content: query,
            }],
        };
        let orsresp = self
            .client
            .post(&self.config.api_url)
            .header("x-api-key", &self.config.api_key)
            .header("anthropic-version", "2023-06-01")
            .header("Content-Type", "application/json")
            .json(&payload)
            .send()
            .await
            .map_err(|e| e.to_string())?;

        let resp: Value = orsresp.json().await.map_err(|e| e.to_string())?;

        let resp: Response = serde_json::from_value(resp).map_err(|e| e.to_string())?;
        Ok(resp
            .content
            .iter()
            .map(|c| c.text.clone())
            .collect::<Vec<String>>()
            .join("\n"))
    }
}
