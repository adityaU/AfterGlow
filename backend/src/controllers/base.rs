#[macro_export]
macro_rules! generate_index {
    ($fn_name:ident, $model:ident, $view:ident, $index_permission:expr) => {
        #[has_permissions($index_permission)]
        pub(crate) async fn $fn_name(pool: web::Data<Arc<DBPool>>) -> impl Responder {
            let conn = pool.get();
            $model::index(&mut conn.unwrap())
                .map(|items| {
                    let resp = items
                        .iter()
                        .map(|item| $view::from_model(item))
                        .collect::<Vec<$view>>();
                    HttpResponse::Ok().json(ResponseData { data: resp })
                })
                .map_err(|err| AGError::<String>::new(err))
        }
    };
}

macro_rules! generate_create {
    ($fn_name:ident, $model:ident, $changeset:ident, $view:ident, $create_permission:expr) => {
        #[has_permissions($create_permission)]
        pub(crate) async fn $fn_name(
            pool: web::Data<Arc<DBPool>>,
            data: web::Json<$changeset>,
        ) -> impl Responder {
            let conn = pool.get();
            $model::create(&mut conn.unwrap(), data.into_inner())
                .map(|item| {
                    HttpResponse::Created().json(ResponseData {
                        data: $view::from_model(&item),
                    })
                })
                .map_err(|err| AGError::<String>::new(err))
        }
    };
}

macro_rules! generate_update {
    ($fn_name:ident, $model:ident, $changeset:ident, $view:ident, $update_permission:expr, $id_data_type:ident) => {
        #[has_permissions($update_permission)]
        pub(crate) async fn $fn_name(
            pool: web::Data<Arc<DBPool>>,
            data: web::Json<$changeset>,
            item_id: web::Path<$id_data_type>,
        ) -> impl Responder {
            let conn = pool.get();
            $model::update(&mut conn.unwrap(), item_id.into_inner(), data.into_inner())
                .map(|item| {
                    HttpResponse::Ok().json(ResponseData {
                        data: $view::from_model(&item),
                    })
                })
                .map_err(|err| AGError::<String>::new(err))
        }
    };
    ($fn_name:ident, $model:ident, $changeset:ident, $view:ident, $update_permission:expr) => {
        #[has_permissions($update_permission)]
        pub(crate) async fn $fn_name(
            pool: web::Data<Arc<DBPool>>,
            data: web::Json<$changeset>,
            item_id: web::Path<i64>,
        ) -> impl Responder {
            let conn = pool.get();
            $model::update(&mut conn.unwrap(), item_id.into_inner(), data.into_inner())
                .map(|item| {
                    HttpResponse::Ok().json(ResponseData {
                        data: $view::from_model(&item),
                    })
                })
                .map_err(|err| AGError::<String>::new(err))
        }
    };
}

macro_rules! generate_show {
    ($fn_name:ident, $model:ident, $view:ident, $show_permission:expr, $id_data_type:ident) => {
        #[has_permissions($show_permission)]
        pub(crate) async fn $fn_name(
            pool: web::Data<Arc<DBPool>>,
            item_id: web::Path<$id_data_type>,
        ) -> impl Responder {
            let conn = pool.get();
            $model::find(&mut conn.unwrap(), item_id.into_inner())
                .map(|item| {
                    HttpResponse::Ok().json(ResponseData {
                        data: $view::from_model(&item),
                    })
                })
                .map_err(|err| {
                    AGError::<String>::new_with_details(err, None, StatusCode::NOT_FOUND)
                })
        }
    };
    ($fn_name:ident, $model:ident, $view:ident, $show_permission:expr) => {
        #[has_permissions($show_permission)]
        pub(crate) async fn $fn_name(
            pool: web::Data<Arc<DBPool>>,
            item_id: web::Path<i64>,
        ) -> impl Responder {
            let conn = pool.get();
            $model::find(&mut conn.unwrap(), item_id.into_inner())
                .map(|item| {
                    HttpResponse::Ok().json(ResponseData {
                        data: $view::from_model(&item),
                    })
                })
                .map_err(|err| error::ErrorNotFound(err))
        }
    };
}

pub(crate) use generate_create;
pub(crate) use generate_index;
pub(crate) use generate_show;
pub(crate) use generate_update;
