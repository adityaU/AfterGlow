use diesel::PgConnection;
use serde::{Deserialize, Serialize};

use crate::repository::models::{OrganizationSetting, Setting, UserSetting};

use super::applicable_str_setting;

pub const DEFAULT_OPENAI_API_URL: &str = "https://api.openai.com/v1/chat/completions";
pub const DEFAULT_CLAUDE_API_URL: &str = "https://api.anthropic.com/v1/messages";
pub const DEFAULT_OLLAMA_API_URL: &str = "http://localhost:11434/api/generate";
pub const DEFAULT_OPENAI_MODEL_NAME: &str = "gpt-4o-mini";
pub const DEFAULT_CLAUDE_MODEL_NAME: &str = "claude-3.5-sonnet";
pub const DEFAULT_OLAMA_MODEL_NAME: &str = "llama3";
#[derive(Default, Serialize, Deserialize, Debug)]
#[serde(rename_all = "UPPERCASE")]
pub enum GenAIProvider {
    OpenAI,
    Claude,
    Ollama,
    #[default]
    None,
}

pub struct GenAIConfiguration {
    pub provider: GenAIProvider,
    pub api_key: String,
    pub model: String,
    pub api_url: String,
}

impl GenAIConfiguration {
    pub fn new(provider: GenAIProvider, api_key: String, model: String, api_url: String) -> Self {
        Self {
            provider,
            api_key,
            model,
            api_url,
        }
    }
}

pub const GEN_AI_CONFIG_NAMES: [&str; 10] = [
    "OPENAI_API_KEY",
    "OPENAI_MODEL_NAME",
    "OPENAI_API_URL",
    "CLAUDE_API_KEY",
    "CLAUDE_MODEL_NAME",
    "CLAUDE_API_URL",
    "OLLAMA_API_KEY",
    "OLLAMA_MODEL_NAME",
    "OLLAMA_API_URL",
    "GEN_AI_PROVIDER",
];
#[derive(Debug, Default)]
struct GenAISettings {
    gen_ai_provider: GenAIProvider,
    open_ai_api_key: String,
    open_ai_model: String,
    open_ai_api_url: String,
    claude_api_key: String,
    claude_model: String,
    claude_api_url: String,
    ollama_api_key: String,
    ollama_model: String,
    ollama_api_url: String,
}

fn applicable_gen_settings(
    conn: &mut PgConnection,
    user_id: i64,
    org_id: i64,
) -> Result<GenAISettings, String> {
    let mut gen_ai_settings = from_user_settings(conn, user_id)?;

    from_org_settings(conn, org_id, &mut gen_ai_settings)?;

    let a = from_global_settings(conn, gen_ai_settings);

    a
}

fn from_global_settings(
    conn: &mut PgConnection,
    _gen_ai_settings: GenAISettings,
) -> Result<GenAISettings, String> {
    let settings = Setting::find_by_names(
        conn,
        GEN_AI_CONFIG_NAMES.iter().map(|u| u.to_string()).collect(),
    )
    .map_err(|err| format!("Could not find Settings.Error: {}", err.to_string()))?;
    let mut gen_ai_settings = GenAISettings::default();

    for setting in settings {
        match setting.name.as_str() {
            "OPENAI_API_KEY" => gen_ai_settings.open_ai_api_key = setting.value.unwrap_or_default(),
            "OPENAI_MODEL_NAME" => {
                gen_ai_settings.open_ai_model = setting.value.unwrap_or_default()
            }
            "OPENAI_API_URL" => gen_ai_settings.open_ai_api_url = setting.value.unwrap_or_default(),
            "CLAUDE_API_KEY" => gen_ai_settings.claude_api_key = setting.value.unwrap_or_default(),
            "CLAUDE_MODEL_NAME" => gen_ai_settings.claude_model = setting.value.unwrap_or_default(),
            "CLAUDE_API_URL" => gen_ai_settings.claude_api_url = setting.value.unwrap_or_default(),
            "OLLAMA_API_KEY" => gen_ai_settings.ollama_api_key = setting.value.unwrap_or_default(),
            "OLLAMA_MODEL_NAME" => gen_ai_settings.ollama_model = setting.value.unwrap_or_default(),
            "OLLAMA_API_URL" => gen_ai_settings.ollama_api_url = setting.value.unwrap_or_default(),
            "GEN_AI_PROVIDER" => {
                gen_ai_settings.gen_ai_provider = serde_json::from_str::<GenAIProvider>(
                    format!("\"{}\"", setting.value.clone().unwrap_or_default()).as_str(),
                )
                .unwrap_or_default()
            }

            _ => (),
        }
    }
    match gen_ai_settings.gen_ai_provider {
        GenAIProvider::None => Err("GenAI is not enabled".to_string()),
        _ => Ok(gen_ai_settings),
    }
}

fn from_org_settings(
    conn: &mut PgConnection,
    org_id: i64,
    gen_ai_settings: &mut GenAISettings,
) -> Result<(), String> {
    let org_settings = OrganizationSetting::find_by_names(
        conn,
        GEN_AI_CONFIG_NAMES.iter().map(|u| u.to_string()).collect(),
        org_id,
    )
    .map_err(|err| format!("Could not find org Settings.Error: {}", err.to_string()))?;
    for org_setting in org_settings {
        match org_setting.name.as_str() {
            "OPENAI_API_KEY" => {
                gen_ai_settings.open_ai_api_key = org_setting.value.unwrap_or_default()
            }
            "OPENAI_MODEL_NAME" => {
                gen_ai_settings.open_ai_model = org_setting.value.unwrap_or_default()
            }
            "OPENAI_API_URL" => {
                gen_ai_settings.open_ai_api_url = org_setting.value.unwrap_or_default()
            }
            "CLAUDE_API_KEY" => {
                gen_ai_settings.claude_api_key = org_setting.value.unwrap_or_default()
            }
            "CLAUDE_MODEL_NAME" => {
                gen_ai_settings.claude_model = org_setting.value.unwrap_or_default()
            }
            "CLAUDE_API_URL" => {
                gen_ai_settings.claude_api_url = org_setting.value.unwrap_or_default()
            }
            "OLLAMA_API_KEY" => {
                gen_ai_settings.ollama_api_key = org_setting.value.unwrap_or_default()
            }
            "OLLAMA_MODEL_NAME" => {
                gen_ai_settings.ollama_model = org_setting.value.unwrap_or_default()
            }
            "OLLAMA_API_URL" => {
                gen_ai_settings.ollama_api_url = org_setting.value.unwrap_or_default()
            }
            "GEN_AI_PROVIDER" => {
                gen_ai_settings.gen_ai_provider = serde_json::from_str::<GenAIProvider>(
                    format!("\"{}\"", org_setting.value.clone().unwrap_or_default()).as_str(),
                )
                .unwrap_or_default()
            }
            _ => (),
        }
    }
    *gen_ai_settings = match gen_ai_settings.gen_ai_provider {
        GenAIProvider::None => GenAISettings::default(),
        _ => return Ok(()),
    };
    Ok(())
}

fn from_user_settings(conn: &mut PgConnection, user_id: i64) -> Result<GenAISettings, String> {
    let user_settings = UserSetting::find_by_names(
        conn,
        GEN_AI_CONFIG_NAMES.iter().map(|u| u.to_string()).collect(),
        user_id,
    )
    .map_err(|err| format!("Could not find user Settings.Error: {}", err.to_string()))?;
    let mut gen_ai_settings = GenAISettings::default();
    for user_setting in user_settings {
        match user_setting.name.as_str() {
            "OPENAI_API_KEY" => {
                gen_ai_settings.open_ai_api_key = user_setting.value.unwrap_or_default()
            }
            "OPENAI_MODEL_NAME" => {
                gen_ai_settings.open_ai_model = user_setting.value.unwrap_or_default()
            }
            "OPENAI_API_URL" => {
                gen_ai_settings.open_ai_api_url = user_setting.value.unwrap_or_default()
            }
            "CLAUDE_API_KEY" => {
                gen_ai_settings.claude_api_key = user_setting.value.unwrap_or_default()
            }
            "CLAUDE_MODEL_NAME" => {
                gen_ai_settings.claude_model = user_setting.value.unwrap_or_default()
            }
            "CLAUDE_API_URL" => {
                gen_ai_settings.claude_api_url = user_setting.value.unwrap_or_default()
            }
            "OLLAMA_API_KEY" => {
                gen_ai_settings.ollama_api_key = user_setting.value.unwrap_or_default()
            }
            "OLLAMA_MODEL_NAME" => {
                gen_ai_settings.ollama_model = user_setting.value.unwrap_or_default()
            }
            "OLLAMA_API_URL" => {
                gen_ai_settings.ollama_api_url = user_setting.value.unwrap_or_default()
            }
            "GEN_AI_PROVIDER" => {
                gen_ai_settings.gen_ai_provider = serde_json::from_str::<GenAIProvider>(
                    format!("\"{}\"", user_setting.value.clone().unwrap_or_default()).as_str(),
                )
                .unwrap_or_default()
            }
            _ => (),
        }
    }
    gen_ai_settings = match gen_ai_settings.gen_ai_provider {
        GenAIProvider::None => GenAISettings::default(),
        _ => return Ok(gen_ai_settings),
    };
    Ok(gen_ai_settings)
}

pub fn gen_ai_configuration(
    conn: &mut PgConnection,
    user_id: i64,
    org_id: i64,
) -> Result<GenAIConfiguration, String> {
    let settings = applicable_gen_settings(conn, user_id, org_id)?;
    match settings.gen_ai_provider {
        GenAIProvider::OpenAI => {
            if settings.open_ai_api_key.is_empty() {
                return Err(
                    "OpenAI API key is required.Please talk to Afterglow Admin to setup."
                        .to_string(),
                );
            }
            let api_url = if settings.open_ai_api_url.is_empty() {
                DEFAULT_OPENAI_API_URL.to_string()
            } else {
                settings.open_ai_api_url
            };
            let model = if settings.open_ai_model.is_empty() {
                DEFAULT_OPENAI_MODEL_NAME.to_string()
            } else {
                settings.open_ai_model
            };
            Ok(GenAIConfiguration::new(
                settings.gen_ai_provider,
                settings.open_ai_api_key,
                model,
                api_url,
            ))
        }
        GenAIProvider::Claude => {
            if settings.claude_api_key.is_empty() {
                return Err(
                    "Claude API key is required.Please talk to Afterglow Admin to setup."
                        .to_string(),
                );
            }
            let api_url = if settings.open_ai_api_url.is_empty() {
                DEFAULT_CLAUDE_API_URL.to_string()
            } else {
                settings.claude_api_url
            };
            let model = if settings.claude_model.is_empty() {
                DEFAULT_CLAUDE_MODEL_NAME.to_string()
            } else {
                settings.claude_model
            };
            Ok(GenAIConfiguration::new(
                settings.gen_ai_provider,
                settings.claude_api_key,
                model,
                api_url,
            ))
        }
        GenAIProvider::Ollama => {
            if settings.ollama_api_key.is_empty() {
                return Err(
                    "ollama key is required.Please talk to Afterglow Admin to setup.".to_string(),
                );
            }
            let api_url = if settings.ollama_api_url.is_empty() {
                DEFAULT_OLLAMA_API_URL.to_string()
            } else {
                settings.ollama_api_url
            };
            let model = if settings.ollama_model.is_empty() {
                DEFAULT_CLAUDE_MODEL_NAME.to_string()
            } else {
                settings.ollama_model
            };
            Ok(GenAIConfiguration::new(
                settings.gen_ai_provider,
                settings.ollama_api_key,
                model,
                api_url,
            ))
        }
        GenAIProvider::None => Err("GenAI is not enabled".to_string()),
    }
}

pub fn is_user_allowed_to_change_gen_ai_config(
    conn: &mut PgConnection,
    user_id: i64,
    org_id: i64,
) -> bool {
    applicable_str_setting(
        conn,
        user_id,
        org_id,
        "USERS_CAN_OVERRIDE_GENAI_CONFIG".to_string(),
        "false".to_string(),
    ) == "true"
}
