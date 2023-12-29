use actix_files as actix_fs;
use actix_fs::NamedFile;
use actix_web::body::BoxBody;
use actix_web::{HttpRequest, HttpResponse};
use askama::Template;
use std::fs;
use std::io;
use std::sync::Arc;

use crate::app::auth::verify_token;

use crate::app::settings::theme;
use crate::controllers::{
    api_action, auth, autocomplete, column, dashboard, database, note, organization,
    organization_setting, permission_set, question, result, setting, snippet, table, tag, team,
    user, user_setting, variable, visualization,
};

use crate::errors::AGError;
use crate::repository::models::{Organization, User};
use crate::repository::DBPool;
use actix_web::body::MessageBody;
use actix_web::dev::{fn_service, ServiceResponse};
use actix_web::{dev::ServiceRequest, web, Error};
use actix_web_grants::permissions::AttachPermissions;

use actix_web_lab::middleware::from_fn;

use actix_web_lab::middleware::Next;

use reqwest::header::{HeaderName, HeaderValue};
use reqwest::StatusCode;

#[derive(Template)] // this will generate the code...
#[template(path = "theme.html")] // using the template in this path, relative
struct ThemeStyleTemplate {
    color_primary: String,
    color_secondary: String,
    color_tertiary: String,
    color_default: String,
    color_white: String,
}

async fn authenticate(
    mut req: ServiceRequest,
    next: Next<impl MessageBody>,
) -> Result<ServiceResponse<impl MessageBody>, Error> {
    if let Some(auth_header) = req.headers().get("Authorization") {
        let header = auth_header.to_str().unwrap_or("invalid");
        let token = header.replace("Bearer ", "");

        let pool = req.app_data::<web::Data<Arc<DBPool>>>().unwrap();
        let mut connection = pool.get().unwrap();
        let token_response = verify_token(&mut connection, token).map_err(|_| {
            actix_web::error::ErrorUnauthorized("Unauthorized: Reason: unable to verify token")
        })?;

        let mut permissions = token_response.permissions;
        permissions.push("Any".to_string());
        req.attach(permissions);

        if None == token_response.user.email {
            return Err(AGError::<String>::new_with_details(
                "Unauthorized: User email not found in token".to_string(),
                None,
                StatusCode::UNAUTHORIZED,
            )
            .into());
        }

        let email_from_token = token_response.user.email.clone().unwrap();

        let user = User::find_by_email(&mut connection, email_from_token).map_err(|_| {
            AGError::<String>::new_with_details(
                "Unauthorized: Reason: User not found".to_string(),
                None,
                StatusCode::UNAUTHORIZED,
            )
        })?;

        let active_org_count = Organization::active_count(&mut connection).map_err(|_| {
            actix_web::error::ErrorUnauthorized("Unable to find Active organizations")
        })?;

        if active_org_count > 0 {
            let organization = Organization::find_by_domain(
                &mut connection,
                User::find_domain(user.email.unwrap().as_str()).as_str(),
            )
            .map_err(|_| {
                AGError::<String>::new_with_details(
                    "Unauthorized: Reason: Domain not found".to_string(),
                    None,
                    StatusCode::UNAUTHORIZED,
                )
            })?;

            if organization.is_deactivated {
                return Err(AGError::<String>::new_with_details(
                    "Unauthorized: Domain is not allowed.".to_string(),
                    None,
                    StatusCode::UNAUTHORIZED,
                )
                .into());
            }

            req.headers_mut().append(
                HeaderName::from_static("organization_id"),
                HeaderValue::from(organization.id),
            );
        } else {
            req.headers_mut().append(
                HeaderName::from_static("organization_id"),
                HeaderValue::from(0),
            );
        }

        req.headers_mut().append(
            HeaderName::from_static("user_id"),
            HeaderValue::from(token_response.user.id),
        );

        let email = token_response.user.email.unwrap_or("".to_string());
        let header_email = HeaderValue::from_str(&email.as_str())
            .map_err(|_| actix_web::error::ErrorUnauthorized("Unauthorized"))?;
        req.headers_mut()
            .append(HeaderName::from_static("user_email"), header_email);
    } else {
        // If authentication fails, return an error response
        return Err(actix_web::error::ErrorUnauthorized("Unauthorized"));
    }

    next.call(req).await

    // post-processing
}

fn scoped_config(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/verify_token/").route(web::post().to(auth::veriy_token)))
        .service(web::resource("/callback/google").route(web::post().to(auth::google_callback)))
        .service(web::resource("/auth/google").route(web::get().to(auth::redirect_to_google)))
        .service(
            web::resource("/variables")
                .wrap(from_fn(authenticate))
                .route(web::get().to(variable::index)),
        )
        .service(
            web::resource("/databases")
                .wrap(from_fn(authenticate))
                .route(web::get().to(database::index))
                .route(web::post().to(database::create)),
        )
        .service(
            web::resource("/databases/search")
                .wrap(from_fn(authenticate))
                .route(web::get().to(database::search)),
        )
        .service(
            web::resource("/databases/{database_id}")
                .wrap(from_fn(authenticate))
                .route(web::patch().to(database::update))
                .route(web::get().to(database::show)),
        )
        .service(
            web::resource("/databases/{database_id}/sync")
                .wrap(from_fn(authenticate))
                .route(web::put().to(database::sync)),
        )
        .service(
            web::resource("/organizations")
                .wrap(from_fn(authenticate))
                .route(web::get().to(organization::index))
                .route(web::post().to(organization::create)),
        )
        .service(
            web::resource("/organizations/{org_id}")
                .wrap(from_fn(authenticate))
                .route(web::patch().to(organization::update))
                .route(web::get().to(organization::show)),
        )
        .service(
            web::resource("/settings")
                .wrap(from_fn(authenticate))
                .route(web::get().to(setting::index))
                .route(web::post().to(setting::create)),
        )
        .service(
            web::resource("/settings/{org_id}")
                .wrap(from_fn(authenticate))
                .route(web::patch().to(setting::update))
                .route(web::get().to(setting::show)),
        )
        .service(
            web::resource("/organization_settings")
                .wrap(from_fn(authenticate))
                .route(web::get().to(organization_setting::index))
                .route(web::post().to(organization_setting::create)),
        )
        .service(
            web::resource("/organization_settings/{org_setting_id}")
                .wrap(from_fn(authenticate))
                .route(web::patch().to(organization_setting::update))
                .route(web::get().to(organization_setting::show)),
        )
        .service(
            web::resource("/users")
                .wrap(from_fn(authenticate))
                .route(web::get().to(user::index))
                .route(web::post().to(user::create)),
        )
        .service(
            web::resource("/users/search")
                .wrap(from_fn(authenticate))
                .route(web::get().to(user::search)),
        )
        .service(
            web::resource("/create_bulk_users")
                .wrap(from_fn(authenticate))
                .route(web::post().to(user::create_bulk_user)),
        )
        .service(
            web::resource("/users/{user_id}")
                .wrap(from_fn(authenticate))
                .route(web::patch().to(user::update))
                .route(web::get().to(user::show)),
        )
        .service(
            web::resource("/users/{user_id}/activate")
                .wrap(from_fn(authenticate))
                .route(web::post().to(user::activate)),
        )
        .service(
            web::resource("/users/{user_id}/deactivate")
                .wrap(from_fn(authenticate))
                .route(web::post().to(user::deactivate)),
        )
        .service(
            web::resource("/teams/{team_id}")
                .wrap(from_fn(authenticate))
                .route(web::put().to(team::update)), // .route(web::delete().to(team::delete)),
        )
        .service(
            web::resource("/teams")
                .wrap(from_fn(authenticate))
                .route(web::get().to(team::index))
                .route(web::post().to(team::create)),
        )
        .service(
            web::resource("/teams/{team_id}/add_user")
                .wrap(from_fn(authenticate))
                .route(web::post().to(team::add_user)),
        )
        .service(
            web::resource("/teams/{team_id}/remove_database")
                .wrap(from_fn(authenticate))
                .route(web::post().to(team::remove_database)),
        )
        .service(
            web::resource("/teams/{team_id}/add_database")
                .wrap(from_fn(authenticate))
                .route(web::post().to(team::add_database)),
        )
        .service(
            web::resource("/teams/{team_id}/remove_user")
                .wrap(from_fn(authenticate))
                .route(web::post().to(team::remove_user)),
        )
        .service(
            web::resource("/user_settings")
                .wrap(from_fn(authenticate))
                .route(web::get().to(user_setting::index))
                .route(web::post().to(user_setting::create)),
        )
        .service(
            web::resource("/user_settings/{user_settings_id}")
                .wrap(from_fn(authenticate))
                .route(web::patch().to(user_setting::update))
                .route(web::get().to(user_setting::show)),
        )
        .service(
            web::resource("/questions")
                .wrap(from_fn(authenticate))
                .route(web::get().to(question::index))
                .route(web::post().to(question::create)),
        )
        .service(
            web::resource("/questions/{question_id}")
                .wrap(from_fn(authenticate))
                .route(web::get().to(question::show))
                .route(web::put().to(question::create)),
        )
        .service(
            web::resource("/tags")
                .wrap(from_fn(authenticate))
                .route(web::get().to(tag::index))
                .route(web::post().to(tag::create)),
        )
        .service(
            web::resource("/tags/search")
                .wrap(from_fn(authenticate))
                .route(web::get().to(tag::search)),
        )
        .service(
            web::resource("/api_actions")
                .wrap(from_fn(authenticate))
                .route(web::get().to(api_action::index))
                .route(web::post().to(api_action::create)),
        )
        .service(
            web::resource("/api_actions/send_request")
                .wrap(from_fn(authenticate))
                .route(web::post().to(api_action::send_request)), // .route(web::post().to(api_action::create)),
        )
        .service(
            web::resource("/api_actions/{api_action_id}")
                .wrap(from_fn(authenticate))
                .route(web::put().to(api_action::update)), // .route(web::post().to(api_action::create)),
        )
        .service(
            web::resource("/api_actions/{api_action_id}/send_request")
                .wrap(from_fn(authenticate))
                .route(web::post().to(api_action::send_request)), // .route(web::post().to(api_action::create)),
        )
        .service(
            web::resource("/visualizations/results")
                .wrap(from_fn(authenticate))
                .route(web::post().to(result::results)),
        )
        .service(
            web::resource("/visualizations/search")
                .wrap(from_fn(authenticate))
                .route(web::get().to(visualization::search)),
        )
        .service(
            web::resource("/visualizations/create_csv")
                .wrap(from_fn(authenticate))
                .route(web::post().to(visualization::create_csv)),
        )
        .service(
            web::resource("/visualizations/{visualization_id}/schedule")
                .wrap(from_fn(authenticate))
                .route(web::post().to(visualization::save_schedule))
                .route(web::get().to(visualization::fetch_schedule)),
        )
        .service(
            web::resource("/visualizations")
                .wrap(from_fn(authenticate))
                .route(web::get().to(visualization::index))
                .route(web::post().to(visualization::create)),
        )
        .service(
            web::resource("/visualizations/{visualization_id}")
                .wrap(from_fn(authenticate))
                .route(web::patch().to(visualization::update))
                .route(web::get().to(visualization::show)),
        )
        .service(
            web::resource("/visualizations/{visualization_id}/results")
                .wrap(from_fn(authenticate))
                .route(web::post().to(result::fetch_viz_results_from_id)),
        )
        .service(
            web::resource("/permission_sets/{permission_set_id}/update_user/{user_id}")
                .wrap(from_fn(authenticate))
                .route(web::put().to(permission_set::update_user)), // .route(web::get().to(user::show)),
        )
        .service(
            web::resource("/permission_sets")
                .wrap(from_fn(authenticate))
                .route(web::get().to(permission_set::index)), // .route(web::post().to(user_setting::create)),
        )
        .service(
            web::resource("/search_tables")
                .wrap(from_fn(authenticate))
                .route(web::get().to(table::search)), // .route(web::post().to(user_setting::create)),
        )
        .service(
            web::resource("/tables/{table_id}")
                .wrap(from_fn(authenticate))
                .route(web::patch().to(table::update))
                .route(web::get().to(table::show)), // .route(web::post().to(user_setting::create)),
        )
        .service(
            web::resource("/columns/{columns_id}")
                .wrap(from_fn(authenticate))
                .route(web::patch().to(column::update)),
        )
        .service(
            web::resource("/dashboards")
                .wrap(from_fn(authenticate))
                .route(web::get().to(dashboard::index))
                .route(web::post().to(dashboard::create)),
        )
        .service(
            web::resource("/dashboards/search")
                .wrap(from_fn(authenticate))
                .route(web::get().to(dashboard::search)),
        )
        .service(
            web::resource("/dashboards/{dashboard_id}")
                .wrap(from_fn(authenticate))
                .route(web::get().to(dashboard::show))
                .route(web::put().to(dashboard::update)),
        )
        .service(
            web::resource("/dashboards/{dashboard_id}/schedule")
                .wrap(from_fn(authenticate))
                .route(web::post().to(dashboard::save_schedule))
                .route(web::get().to(dashboard::fetch_schedule)),
        )
        .service(
            web::resource("/notes")
                .wrap(from_fn(authenticate))
                .route(web::post().to(note::create)),
        )
        .service(
            web::resource("/notes/{note_id}")
                .wrap(from_fn(authenticate))
                .route(web::get().to(note::show))
                .route(web::put().to(note::update)),
        )
        .service(
            web::resource("/snippets")
                .wrap(from_fn(authenticate))
                .route(web::get().to(snippet::index))
                .route(web::post().to(snippet::create)),
        )
        .service(
            web::resource("/snippets/{snippets_id}")
                .wrap(from_fn(authenticate))
                .route(web::get().to(snippet::show))
                .route(web::put().to(snippet::update)),
        )
        .service(
            web::resource("recipients")
                .wrap(from_fn(authenticate))
                .route(web::get().to(autocomplete::recipients)),
        )
        .service(
            web::resource("/sql_autocomplete")
                .wrap(from_fn(authenticate))
                .route(web::get().to(autocomplete::complete)),
        );
}

fn static_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        actix_fs::Files::new("/", "../frontend-v2/dist/spa/").default_handler(fn_service(
            |req: ServiceRequest| async {
                let (req, _) = req.into_parts();

                let pool = req.app_data::<web::Data<Arc<DBPool>>>().unwrap();
                let mut contents = fs::read_to_string("../frontend-v2/dist/spa/index.html")
                    .expect("index file is not available");
                let theme_colors = theme::get(&mut pool.get().unwrap());
                contents += (ThemeStyleTemplate {
                    color_primary: theme_colors.primary_color,
                    color_secondary: theme_colors.secondary_color,
                    color_tertiary: theme_colors.tertiary_color,
                    color_default: theme_colors.default_color,
                    color_white: theme_colors.white_color,
                }
                .render()
                .unwrap()
                .as_str());
                let res = HttpResponse::new(StatusCode::OK).set_body(BoxBody::new(contents));
                Ok(ServiceResponse::new(req, res))
            },
        )),
    );
}

// this function could be located in a different module

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/api/v2").configure(scoped_config))
        .service(web::scope("").configure(static_config));
}
