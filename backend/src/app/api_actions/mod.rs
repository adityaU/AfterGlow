use std::collections::HashMap;

use reqwest::{
    header::{HeaderMap, HeaderName, HeaderValue},
    Error, Response, StatusCode,
};
use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};

use crate::repository::models::ApiActionChangeset;

use super::results::{payload_adapter::Variable, query_builders::sql_base::VARIABLE_REGEX};

#[derive(Debug, Serialize, Deserialize)]
pub struct RedirectResponse {
    redirect_url: String,
    status: u16,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BackendCallResponse {
    status_code: u16,
    response_body: String,
    response_headers: HashMap<String, String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum ApiActionResponse {
    Redirect(RedirectResponse),
    BackendCall(BackendCallResponse),
}

fn replace_variables(
    mut api_action: ApiActionChangeset,
    variables: Vec<Variable>,
) -> ApiActionChangeset {
    let mut variable_map = HashMap::new();
    variables.into_iter().for_each(|v| {
        let value = match &v.value {
            Value::Bool(b) => b.to_string(),
            Value::Number(n) => n.to_string(),
            Value::String(s) => s.to_string(),
            _ => "".to_string(),
        };
        variable_map.insert(v.name, value);
    });
    let mut body = api_action.body.unwrap_or_default();
    let mut url = api_action.url;

    let headers: Result<HashMap<Option<String>, Option<String>>, _> =
        serde_json::from_value(api_action.headers.clone().unwrap_or_default());

    let headers = match headers {
        Ok(headers) => {
            let mut new_headers = HashMap::new();
            headers.into_iter().for_each(|(k, v)| {
                let new_key = replace_variable(&variable_map, k.unwrap_or_default());
                let new_value = replace_variable(&variable_map, v.unwrap_or_default());
                new_headers.insert(new_key, new_value);
            });
            serde_json::to_value(new_headers).ok()
        }
        Err(_) => api_action.headers.clone(),
    };

    body = replace_variable(&variable_map, body);
    url = replace_variable(&variable_map, url);

    api_action.body = Some(body);
    api_action.url = url;
    api_action.headers = headers;
    api_action
}

fn replace_variable(replacements: &HashMap<String, String>, query: String) -> String {
    VARIABLE_REGEX
        .replace_all(query.as_str(), |captures: &fancy_regex::Captures| {
            let variable_name = &captures[1];
            match replacements.get(variable_name.trim()) {
                Some(value) => value.to_string(),
                None => captures[0].to_string(),
            }
        })
        .to_string()
}

pub async fn fetch_response(
    api_action: ApiActionChangeset,
    _variables: Vec<Variable>,
) -> Result<ApiActionResponse, String> {
    let aa = replace_variables(api_action, _variables);
    let default_headers: Map<String, Value> = Map::new();
    let req_headers = make_reqwest_headers(aa.headers.unwrap_or(Value::Object(default_headers)))?;

    match aa.open_option.unwrap_or_default().as_str() {
        "open-new-tab" => {
            return Ok(ApiActionResponse::Redirect(RedirectResponse {
                redirect_url: aa.url,
                status: StatusCode::MOVED_PERMANENTLY.as_u16(),
            }))
        }
        "open-same-tab" => {
            return Ok(ApiActionResponse::Redirect(RedirectResponse {
                redirect_url: aa.url,
                status: StatusCode::TEMPORARY_REDIRECT.as_u16(),
            }))
        }
        _ => (),
    }

    use crate::repository::models::HTTPMethod::*;
    let response = match aa.method.unwrap_or_default() {
        GET => get(aa.url, req_headers).await,
        POST => post(aa.url, req_headers, aa.body.unwrap_or_default()).await,
        PUT => put(aa.url, req_headers, aa.body.unwrap_or_default()).await,
        DELETE => delete(aa.url, req_headers).await,
        PATCH => patch(aa.url, req_headers, aa.body.unwrap_or_default()).await,
    }
    .map_err(|err| format!("Error making request: {}", err))?;

    let headers = response
        .headers()
        .clone()
        .into_iter()
        .map(|(k, v)| {
            (
                k.unwrap_or(HeaderName::from_static("invalid_header"))
                    .to_string(),
                v.to_str().unwrap_or("Invalid value").to_string(),
            )
        })
        .collect::<HashMap<String, String>>();

    Ok(ApiActionResponse::BackendCall(BackendCallResponse {
        status_code: response.status().as_u16(),
        response_headers: headers,
        response_body: response.text().await.map_err(|err| err.to_string())?,
    }))
}

fn make_reqwest_headers(api_action_headers: Value) -> Result<HeaderMap, String> {
    let headers: HashMap<Option<String>, Option<String>> =
        serde_json::from_value(api_action_headers)
            .map_err(|err| format!("Error Decoding Headers: {}", err))?;
    let mut req_headers = reqwest::header::HeaderMap::new();
    headers.iter().for_each(|(k, v)| {
        let header_name = HeaderName::from_bytes(k.clone().unwrap_or_default().as_bytes())
            .unwrap_or(HeaderName::from_static("invalid_header"));
        let header_value = HeaderValue::from_str(v.clone().unwrap_or_default().as_str()).unwrap();
        req_headers.insert(header_name, header_value);
    });
    Ok(req_headers)
}

async fn get(url: String, headers: HeaderMap) -> Result<Response, Error> {
    let client = reqwest::Client::new();
    client.get(url).headers(headers).send().await
}

async fn post(url: String, headers: HeaderMap, body: String) -> Result<Response, Error> {
    let client = reqwest::Client::new();
    client.post(url).headers(headers).body(body).send().await
}

async fn patch(url: String, headers: HeaderMap, body: String) -> Result<Response, Error> {
    let client = reqwest::Client::new();
    client.patch(url).headers(headers).body(body).send().await
}

async fn put(url: String, headers: HeaderMap, body: String) -> Result<Response, Error> {
    let client = reqwest::Client::new();
    client.put(url).headers(headers).body(body).send().await
}

async fn delete(url: String, headers: HeaderMap) -> Result<Response, Error> {
    let client = reqwest::Client::new();
    client.delete(url).headers(headers).send().await
}
