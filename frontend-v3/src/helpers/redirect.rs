use web_sys::window;

pub fn relative_redirect_to(url: &str) {
    if let Some(window) = window() {
        let url = window.location().origin().unwrap_or_default() + url;
        window.location().set_href(url.as_str()).unwrap();
    }
}
