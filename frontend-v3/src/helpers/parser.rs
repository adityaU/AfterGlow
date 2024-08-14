use std::str::FromStr;
pub fn parse_string_to_option<T: FromStr>(s: String) -> Option<T> {
    match T::from_str(&s) {
        Ok(value) => Some(value),
        Err(_) => None,
    }
}
