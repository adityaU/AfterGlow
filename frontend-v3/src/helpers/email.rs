use fancy_regex::Regex;
use lazy_static::lazy_static;
lazy_static! {
    static ref EMAIL_REGEX: Regex =
        Regex::new(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$").unwrap();
}

pub fn is_valid_email(email: &str) -> bool {
    EMAIL_REGEX.is_match(email).ok().unwrap_or_default()
}
