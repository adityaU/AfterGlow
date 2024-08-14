use url::Url;
use web_sys::{console, wasm_bindgen::JsValue};

pub fn is_valid_url(url: &str) -> bool {
    console::log_1(&JsValue::from_str(url));
    console::log_1(&JsValue::from_str(&format!(
        "Url::parse(url) {:?}",
        Url::parse(url)
    )));
    Url::parse(url).is_ok()
}
