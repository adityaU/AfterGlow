pub mod claude;
pub mod ollama;
pub mod open_ai;

use std::sync::Arc;

use diesel::PgConnection;

use super::settings::gen_ai::{gen_ai_configuration, GenAIProvider};

pub const NOUN_AND_VERBS_SYSTEM_PROMPT: &str = "You are a grammer expert and also know json. You can only return noun and verbs from user provided text. Nouns should always be singlular and verrbs in present tense. only respond in json. json looks like {\"nouns\": [\"noun1\", \"noun2\"],\"verbs\": [\"verb1\",\"verb2\"]}";
pub const DATABASE_EXPERT_SYSTEM_PROMPT: &str = "You are a database expert. you only return query in the response. only provide naked query without markdown or any other formatting or any other text.You understand all known database dialects. user will provide database name in the request, Only generate query for that dialect, use aliases present in the existing query as well. user provides a list of columns, use only those columns. user might provide sql query in jinja template form. don't mess up the variables.";

#[async_trait::async_trait]
pub trait GenAIClientProvider: Send + Sync {
    async fn request(&self, query: String, system_prompt: String) -> Result<String, String>;
}

pub async fn call(
    conn: &mut PgConnection,
    user_id: i64,
    org_id: i64,
    query: String,
    system_prompt: &str,
) -> Result<String, String> {
    let _config = gen_ai_configuration(conn, user_id, org_id)?;
    let client = get_client(conn, user_id, org_id)?;
    println!("calling=====================================: {}", &query);
    client.request(query, system_prompt.to_owned()).await
}

fn get_client(
    conn: &mut PgConnection,
    user_id: i64,
    org_id: i64,
) -> Result<Arc<dyn GenAIClientProvider>, String> {
    let config = gen_ai_configuration(conn, user_id, org_id)?;
    match config.provider {
        GenAIProvider::OpenAI => Ok(Arc::new(open_ai::Client::new(
            conn, config, user_id, org_id,
        ))),
        GenAIProvider::Ollama => Ok(Arc::new(ollama::Client::new(conn, config, user_id, org_id))),
        GenAIProvider::Claude => Ok(Arc::new(claude::Client::new(conn, config, user_id, org_id))),
        GenAIProvider::None => Err("No provider found".to_string()),
    }
}
