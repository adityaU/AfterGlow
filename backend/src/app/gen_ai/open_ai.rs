use crate::app::settings::gen_ai::GenAIConfiguration;

use super::GenAIClientProvider;

use diesel::PgConnection;
use serde::Deserialize;
use serde::Serialize;
use serde_json::Value;

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Response {
    pub id: String,
    pub object: String,
    pub created: i64,
    pub model: String,
    pub usage: Usage,
    pub choices: Vec<Choice>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Usage {
    pub prompt_tokens: i64,
    pub completion_tokens: i64,
    pub total_tokens: i64,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Choice {
    pub message: Message,
    pub logprobs: Value,
    pub finish_reason: String,
    pub index: i64,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Message {
    pub role: Roles,
    pub content: String,
}
#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Roles {
    #[default]
    User,
    System,
    Assistant,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct Payload {
    pub model: String,
    pub messages: Vec<Message>,
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
            messages: vec![
                Message {
                    role: Roles::System,
                    content: system_prompt.to_string(),
                },
                Message {
                    role: Roles::User,
                    content: query,
                },
            ],
        };
        let resp = self
            .client
            .post(&self.config.api_url)
            .header("Authorization", format!("Bearer {}", &self.config.api_key))
            .header("Content-Type", "application/json")
            .json(&payload)
            .send()
            .await
            .map_err(|e| e.to_string())?;

        let resp: Response = resp.json().await.map_err(|e| e.to_string())?;
        Ok(resp
            .choices
            .iter()
            .map(|c| c.message.content.clone())
            .collect::<Vec<String>>()
            .join("\n"))
    }
}
