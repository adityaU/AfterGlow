use crate::app::settings::gen_ai::GenAIConfiguration;

use super::GenAIClientProvider;

use diesel::PgConnection;
use serde::Deserialize;
use serde::Serialize;

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct Payload {
    pub model: String,
    pub prompt: String,
    pub system: String,
    pub stream: bool,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct Response {
    pub response: String,
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
            prompt: query,
            system: system_prompt.to_string(),
            stream: false,
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
        Ok(resp.response)
    }
}
