use serde_json::json;
use sha2::{Digest, Sha256};

use crate::app::databases::DBConfig;

pub fn hashed_db_credentials(db: &DBConfig) -> String {
    let data = format!("{}", json!(db),);

    let mut hasher = Sha256::new();
    Digest::update(&mut hasher, data);

    let result = hasher.finalize();

    format!("{:x}", result)
}

pub fn make_alias(table_name: &str) -> String {
    let is_delimiter = |c: char| c == '_' || c == '"' || c == ' ' || c == '.';

    let parts: Vec<&str> = table_name.split(is_delimiter).collect();

    let first_chars: Vec<char> = parts
        .iter()
        .filter_map(|&part| part.chars().next())
        .collect();

    first_chars.into_iter().collect()
}
