use actix_web::HttpRequest;

pub(crate) fn get_current_user_ord_id(req: &HttpRequest) -> i64 {
    let current_users_org = req
        .headers()
        .get("organization_id")
        .unwrap()
        .to_str()
        .unwrap()
        .parse::<i64>()
        .ok()
        .unwrap_or(0);
    current_users_org
}

pub(crate) fn get_current_user_id(req: &HttpRequest) -> i64 {
    let current_user_id = req
        .headers()
        .get("user_id")
        .unwrap()
        .to_str()
        .unwrap()
        .parse::<i64>()
        .ok()
        .unwrap_or(0);
    current_user_id
}

pub(crate) fn get_current_user_email(req: &HttpRequest) -> String {
    let current_user_email = req
        .headers()
        .get("user_email")
        .unwrap()
        .to_str()
        .unwrap()
        .parse::<String>()
        .ok()
        .unwrap_or("".to_string());
    current_user_email
}
