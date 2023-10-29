use actix_web::{error, web, HttpRequest, HttpResponse, Responder};

use crate::{
    controllers::common::ResponseData,
    repository::{models::Tag, models::TagView, DBPool},
};
use actix_web_grants::{permissions::AuthDetails, proc_macro::has_permissions};

#[has_permissions("Any")]
pub(crate) async fn index(
    pool: web::Data<DBPool>,
    req: HttpRequest,
    auth_details: AuthDetails,
) -> impl Responder {
    let conn = pool.get();
    let user_email = req
        .headers()
        .get("user_email")
        .unwrap()
        .to_str()
        .unwrap()
        .to_string();
    let permissions = auth_details.permissions;
    Tag::scoped_index(&mut conn.unwrap(), user_email, permissions)
        .map(|items| {
            let resp = items
                .iter()
                .map(|item| TagView::from_model(item))
                .collect::<Vec<TagView>>();
            HttpResponse::Ok().json(ResponseData { data: resp })
        })
        .map_err(|err| error::ErrorBadRequest(err))
}
