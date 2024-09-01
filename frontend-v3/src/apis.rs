pub mod apps;
pub mod dashboards;
pub mod session;
pub mod user;

use reqwest::{Client, RequestBuilder, Response, StatusCode};
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use serde_json::Value;
use std::{collections::HashMap, error::Error};
use web_sys::window;

use std::fmt::Debug as DebugTrait;
const BASE_PATH: &str = "/api/v2";

pub trait ApiResponseData: Clone + Default + Serialize + PartialEq + DebugTrait {}

// Blanket implementation for all types that satisfy the trait bounds
impl<T> ApiResponseData for T where
    T: Clone + Default + Serialize + DeserializeOwned + PartialEq + DebugTrait
{
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(untagged)]
enum ResponseEnum<T>
where
    T: ApiResponseData,
{
    Success { data: T },
    Error { error: String },
}

impl<T> Default for ResponseEnum<T>
where
    T: ApiResponseData,
{
    fn default() -> Self {
        ResponseEnum::Success { data: T::default() }
    }
}

pub fn handle_response<T: ApiResponseData + DeserializeOwned>(
    response: ApiResponse,
) -> Result<T, String> {
    let response: ResponseEnum<T> =
        serde_json::from_value(response.message).map_err(|e| e.to_string())?;
    match response {
        ResponseEnum::Success { data } => Ok(data),
        ResponseEnum::Error { error } => Err(error),
    }
}

#[derive(Debug)]
pub struct ApiResponse {
    status: StatusCode,
    message: serde_json::Value,
}

struct ApiClient {
    client: Client,
    headers: HashMap<String, String>,
    base_url: String,
}

impl ApiClient {
    fn new() -> Self {
        let client = Client::new();
        let mut headers = HashMap::new();

        headers.insert("Accept".to_string(), "application/json".to_string());
        headers.insert(
            "Accept-Encoding".to_string(),
            "gzip, deflate, br".to_string(),
        );
        headers.insert(
            "Accept-Language".to_string(),
            "en-GB,en-US;q=0.9,en;q=0.8".to_string(),
        );

        headers.insert("Access-Control-Allow-Origin".to_string(), "*".to_string());
        headers.insert("Authorization".to_string(), "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImltLmFkaXR5YXVAZ21haWwuY29tIiwiZnVsbF9uYW1lIjoiQWRpdHlhIFVwYWRoeWF5IiwiaWQiOiI1IiwicHJvZmlsZV9waWMiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMVm8xNXJ5Nm44NGtmeDRRTmJhdC1pVGtIaVRZdlNmUmlFRTR5THdQeFhsVUxOM0E9czk2LWMifQ.4DI_AVCgUPSVrP96-FZdt5S2CLe1YDZypa74sMwqRNg".to_string());
        let mut base_url = window()
            .expect("no global `window` exists")
            .location()
            .origin()
            .unwrap_or_default();

        base_url = format!("{}{}", base_url, BASE_PATH);

        Self {
            client,
            headers,
            base_url,
        }
    }

    async fn make_api_response(response: Response) -> Result<ApiResponse, Box<dyn Error>> {
        Ok(ApiResponse {
            status: response.status(),
            message: response.json::<Value>().await?,
        })
    }

    fn with_headers(&self, request_builder: RequestBuilder) -> RequestBuilder {
        // Create a new RequestBuilder with headers applied
        let new_request_builder = request_builder.try_clone();

        if new_request_builder.is_none() {
            return request_builder;
        }
        let mut new_request_builder = new_request_builder.unwrap();

        for (key, value) in &self.headers {
            new_request_builder = new_request_builder.header(key, value);
        }

        // Update the original request_builder with the new one
        new_request_builder
    }

    async fn get<T: ApiResponseData + DeserializeOwned>(
        &self,
        path: &str,
    ) -> Result<T, Box<dyn Error>> {
        let url = format!("{}{}", self.base_url, path);
        let response = self.with_headers(self.client.get(&url)).send().await?;
        let api_response = Self::make_api_response(response).await?;
        Ok(handle_response::<T>(api_response)?)
    }

    async fn post<T: ApiResponseData + DeserializeOwned>(
        &self,
        path: &str,
        body: serde_json::Value,
    ) -> Result<T, Box<dyn Error>> {
        let url = format!("{}{}", self.base_url, path);
        let response = self
            .with_headers(self.client.post(&url))
            .json(&body)
            .send()
            .await?;
        let api_response = Self::make_api_response(response).await?;
        Ok(handle_response::<T>(api_response)?)
    }

    async fn put<T: ApiResponseData + DeserializeOwned>(
        &self,
        path: &str,
        body: serde_json::Value,
    ) -> Result<T, Box<dyn Error>> {
        let url = format!("{}{}", self.base_url, path);
        let response = self
            .with_headers(self.client.put(&url))
            .json(&body)
            .send()
            .await?;
        let api_response = Self::make_api_response(response).await?;
        Ok(handle_response::<T>(api_response)?)
    }

    async fn delete<T: ApiResponseData + DeserializeOwned>(
        &self,
        path: &str,
    ) -> Result<T, Box<dyn Error>> {
        let url = format!("{}{}", self.base_url, path);
        let response = self.with_headers(self.client.delete(&url)).send().await?;
        let api_response = Self::make_api_response(response).await?;
        Ok(handle_response::<T>(api_response)?)
    }
}
