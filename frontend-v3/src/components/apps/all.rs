use icondata as i;
use leptos::{
    component, create_action, create_signal, view, IntoView, SignalGet, SignalSet,
};
use leptos_icons::Icon;
use web_sys::{console, wasm_bindgen::JsValue};

use crate::{
    apis::apps::{self},
    components::header::Header,
    helpers::redirect::relative_redirect_to,
};

#[component]
pub fn AppsAll() -> impl IntoView {
    let (apps, set_apps) = create_signal(Vec::new());
    let (err, set_err) = create_signal(None::<String>);

    let app_load_action = create_action({
        let set_apps = set_apps.clone();
        let set_err = set_err.clone();
        move |_| async move {
            match apps::fetch_all().await {
                Ok(apps_list) => {
                    console::log_1(&JsValue::from_str(
                        &format!("Apps_list: {:?}", apps_list).as_str(),
                    ));
                    set_apps.set(apps_list);
                }
                Err(e) => set_err.set(Some(e.to_string())),
            }
        }
    });

    app_load_action.dispatch(());

    view! {
        <Header>
            <h3>"Apps"</h3>
        </Header>

        <div class="tw-flex tw-justify-center tw-items-center tw-gap-4 tw-mt-4 tw-py-auto tw-flex-wrap tw-m-auto">
            {move || match err.get() {
                Some(err_msg) => view! { <div class="error">{err_msg}</div> }.into_view(),
                None => {
                    let apps_view = move || {
                        apps.get()
                            .iter()
                            .map(|app| {
                                let app_id = app.id;
                                let app_color = app.color.clone();
                                view! {
                                    <div
                                        class="tw-flex tw-items-stretch tw-border tw-bg-white  tw-rounded-2xl tw-w-[400px] tw-cursor-pointer"
                                        on:click=move |_| {
                                            relative_redirect_to(format!("/apps/{}", app_id).as_str())
                                        }
                                    >

                                        <div
                                            class="tw-px-4 tw-py-2 tw-rounded-l-2xl"
                                            style=move || { format!("background-color: {}", app_color) }
                                        >

                                            <Icon
                                                icon=i::RiAppsSystemFill
                                                class="icon-default tw-h-[60px] tw-w-[60px] tw-stroke-default/60 tw-fill-default/60"
                                            />

                                        </div>
                                        <div class="tw-ml-2 tw-flex tw-flex-col tw-w-[280px] tw-px-4 tw-py-2">
                                            <h3 class="tw-text-primary tw-font-semibold tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap tw-w-[280px]">
                                                {app.name.clone()}
                                            </h3>
                                            <div class="note tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap tw-w-[280px]">
                                                {app.description.clone()}
                                            </div>
                                        </div>
                                    </div>
                                }
                            })
                            .collect::<Vec<_>>()
                    };
                    view! {
                        {apps_view}
                        <div
                            class="tw-flex tw-items-center tw-border tw-px-4 tw-py-2 tw-rounded-2xl tw-w-[400px] tw-cursor-pointer tw-bg-primary/30"
                            on:click=move |_| { relative_redirect_to("/apps/create") }
                        >
                            <Icon
                                icon=i::TbPlus
                                class="icon-default tw-h-[60px] tw-w-[60px] tw-stroke-default/60 tw-fill-default/60"
                            />
                            <div class="tw-ml-2 tw-flex tw-justify-center tw-h-full">
                                <h3 class="tw-text-primary tw-font-semibold tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap">
                                    "Create a new app"
                                </h3>
                            </div>
                        </div>
                    }
                        .into_view()
                }
            }}

        </div>
    }
}
