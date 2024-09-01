use common::models::app::AppView;
use common::models::app_column::AppColumnView;
use common::models::app_table::AppTableView;
use icondata as i;
use leptos::{
    component, create_action, create_signal, view, IntoView, SignalGet, SignalSet, SignalWith,
};
use leptos::{
    create_effect, create_memo, spawn_local, watch, Params, ReadSignal, SignalUpdate, WriteSignal,
};
use leptos_icons::Icon;
use leptos_router::{use_params, Params};
use web_sys::wasm_bindgen::JsCast;
use web_sys::{console, wasm_bindgen::JsValue};
use web_sys::{window, HtmlElement, SubmitEvent};

use crate::apis::apps;
use crate::components::base::button::Button;
use crate::components::base::input::Input;
use crate::components::views::table::Table;
use crate::helpers::colors::{add_white, hex_to_rgb, is_light_color};

#[derive(Params, PartialEq)]
struct AppsShowParams {
    id: Option<i32>,
}
pub fn change_primary_color(app: ReadSignal<AppView>) {
    let window = window().expect("no global `window` exists");
    let document = window.document().expect("should have a document on window");
    let doc_element = document
        .document_element()
        .expect("should have a document element");
    let html_element = doc_element
        .dyn_into::<HtmlElement>()
        .expect("document element should be an HtmlElement");

    let hex = app.get().color.clone();
    let colors = hex_to_rgb(hex.as_str());
    if let Ok((r, g, b)) = colors {
        let (new_r, new_g, new_b) = add_white(r, g, b, 0.1);
        html_element
            .style()
            .set_property("--color-primary", &format!("{} {} {}", new_r, new_g, new_b))
            .expect("failed to set --color-primary");

        if is_light_color(r, g, b) {
            html_element
                .style()
                .set_property("--color-text-onprimary", "32 33 36")
                .expect("failed to set --color-text-onprimary");
        } else {
            html_element
                .style()
                .set_property("--color-text-onprimary", "255 255 255")
                .expect("failed to set --color-text-onprimary");
        }
    }

    // Set the CSS variables
    // doc_element
    //     .style()
    //     .set_property("--main-text-color", "darkblue")
    //     .expect("failed to set --main-text-color");
}

#[component]
pub fn AppsShow() -> impl IntoView {
    let params = use_params::<AppsShowParams>();

    // id: || -> i32
    let id =
        move || params.with(|params| params.as_ref().map(|params| params.id).unwrap_or_default());
    let (app, set_app) = create_signal(AppView::default());

    create_effect(move |_| change_primary_color(app));
    let (tables, set_tables) = create_signal(Vec::new());
    let (columns, set_columns) = create_signal(Vec::new());
    let (selected_table, set_selected_table) = create_signal(None::<AppTableView>);

    create_effect(move |_| {
        set_selected_table.set(tables.get().first().cloned());
    });

    let (err, set_err) = create_signal(None::<String>);

    let app_load_action = create_action({
        move |_| async move {
            match apps::fetch(id().unwrap_or_default()).await {
                Ok(app_details) => {
                    console::log_1(&JsValue::from_str(&format!(
                        "App details: {:?}",
                        app_details
                    )));
                    set_app.set(app_details);
                }
                Err(e) => set_err.set(Some(e.to_string())),
            }
        }
    });
    app_load_action.dispatch(());
    let _ = watch(
        move || selected_table.get(),
        move |new, old, _| {
            if Some(new) == old {
                return;
            }
            let new = new.clone();
            spawn_local(async move {
                if let Some(table) = new {
                    let columns = apps::fetch_columns(table.id).await;
                    match columns {
                        Ok(columns) => set_columns.set(columns),
                        Err(e) => set_err.set(Some(e.to_string())),
                    }
                }
            });
        },
        false,
    );

    let app_tables_load_action = create_action({
        move |_| async move {
            match apps::fetch_tables(id().unwrap_or_default()).await {
                Ok(table_details) => {
                    set_tables.set(table_details);
                }
                Err(e) => set_err.set(Some(e.to_string())),
            }
        }
    });
    app_tables_load_action.dispatch(());

    view! {
        <div class="tw-flex tw-w-full tw-h-full">
            <SidebarTableList
                tables=tables
                app=app
                set_tables=set_tables
                set_selected_table=set_selected_table
            />
            <TableDetails table=selected_table columns=columns set_columns=set_columns/>
        </div>
    }
}

#[component]
pub fn SidebarTableList(
    tables: ReadSignal<Vec<AppTableView>>,
    set_tables: WriteSignal<Vec<AppTableView>>,
    set_selected_table: WriteSignal<Option<AppTableView>>,
    app: ReadSignal<AppView>,
) -> impl IntoView {
    let (open, set_open) = create_signal(false);

    view! {
        <div
            class="tw-h-full tw-border-r"
            style=move || { format!("background-color: {};", app.get().color.clone()) }
        >
            <h3 class="tw-overflow-hidden tw-w-[300px] tw-whitespace-nowrap tw-text-ellipsis tw-px-4 tw-py-2 tw-text-text-onprimary">
                {move || app.get().name.clone()}
            </h3>
            {move || {
                tables
                    .get()
                    .iter()
                    .map(|table| {
                        let t = table.clone();
                        view! {
                            <div
                                class="tw-overflow-hidden tw-w-[300px] tw-whitespace-nowrap tw-text-ellipsis tw-px-4  menu-item tw-flex tw-items-center"
                                on:click=move |_| {
                                    set_selected_table.set(Some(t.clone()));
                                }
                            >

                                <Icon
                                    icon=i::TbTable
                                    class="tw-h-[40px] tw-w-[40px] tw-stroke-text-onprimary/60 tw-fill-text-onprimary/60"
                                />
                                <div class="tw-overflow-hidden tw-w-[300px] tw-whitespace-nowrap tw-text-ellipsis tw-px-4 tw-py-2 tw-text-text-onprimary">
                                    <h4>{table.name.clone()}</h4>
                                    <div class="note tw-text-text-onprimary/80">
                                        {table.description.clone()}
                                    </div>
                                </div>
                            </div>
                        }
                    })
                    .collect::<Vec<_>>()
            }}

            <div
                class="tw-overflow-hidden tw-w-[300px] tw-whitespace-nowrap tw-text-ellipsis tw-px-4 tw-py-2 tw-text-text-onprimary"
                on:click=move |_| { set_open.set(true) }
            >
                Create New Table
            </div>
        </div>
        <CreateNewTableModal app=app open=open set_open=set_open set_tables=set_tables/>
    }
}

#[component]
pub fn CreateNewTableModal(
    app: ReadSignal<AppView>,
    open: ReadSignal<bool>,
    set_open: WriteSignal<bool>,
    set_tables: WriteSignal<Vec<AppTableView>>,
) -> impl IntoView {
    let (name, set_name) = create_signal(String::from(""));
    let (desc, set_desc) = create_signal(String::from(""));
    let (error_message, set_error_message) = create_signal(None::<String>);
    let (desc_error_message, set_desc_error_message) = create_signal(None::<String>);
    let create_table_action = create_action(move |&(ref input, ref desc): &(String, String)| {
        let input = input.clone();
        let description = desc.clone();
        let set_error_message = set_error_message.clone();
        async move {
            match apps::create_table(input, description, app.get().id).await {
                Ok(table) => {
                    set_tables.update(|tables| {
                        tables.push(table);
                    });
                    set_error_message.set(None);
                    set_desc_error_message.set(None);
                    set_open.set(false);
                }
                Err(e) => {
                    set_error_message.set(Some(e.to_string()));
                }
            }
        }
    });

    let handle_submit = move |ev: SubmitEvent| {
        ev.prevent_default(); // Prevent the default form submission behavior
        if name.get().is_empty() {
            set_error_message.set(Some("Name cannot be empty".to_string()));
        } else {
            set_error_message.set(None);
            // Handle form submission here
        }
        if error_message.get().is_none() {
            create_table_action.dispatch((name.get(), desc.get()));
        }
    };

    let name_memo = create_memo(move |_| Some(name.get().clone()));
    let set_name_updater_func = move |s: Option<String>| {
        set_name.set(s.unwrap_or_default());
        set_error_message.set(None);
    };
    let desc_memo = create_memo(move |_| Some(desc.get().clone()));
    let set_desc_updater_func = move |s: Option<String>| {
        set_desc.set(s.unwrap_or_default());
    };

    view! {
        <div class=move || {
            let classes = "tw-absolute tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-justify-center tw-items-center";
            if open.get() { classes.to_string() } else { format!("tw-hidden {}", classes) }
        }>
            <div class="tw-bg-white tw-rounded-lg tw-p-4 tw-w-1/3">
                <h1 class="tw-text-2xl tw-mb-4">"Create a new table"</h1>
                <form on:submit=handle_submit>
                    <Input
                        label="Name".to_string()
                        value=name_memo
                        set_value=Box::new(set_name_updater_func)
                        input_type="text".to_string()
                        error_message=error_message
                        classes="tw-mb-4".to_string()
                    />
                    <Input
                        label="Description".to_string()
                        value=desc_memo
                        set_value=Box::new(set_desc_updater_func)
                        input_type="text".to_string()
                        error_message=desc_error_message
                        classes="tw-mb-4".to_string()
                    />
                    <div class="tw-flex tw-justify-end">
                        <Button label="Create".to_string()/>
                    </div>
                </form>
            </div>
        </div>
    }
}

#[component]
pub fn TableDetails(
    table: ReadSignal<Option<AppTableView>>,
    columns: ReadSignal<Vec<AppColumnView>>,
    set_columns: WriteSignal<Vec<AppColumnView>>,
) -> impl IntoView {
    console::log_1(&JsValue::from_str(&format!(
        "Table: {:?}, Columns: {:?}",
        table.get(),
        columns.get()
    )));
    let (rows, set_rows) = create_signal(Vec::new());
    view! {
        {move || {
            if table.get().is_some() {
                view! { <Table columns=columns table=table set_columns=set_columns rows=rows set_rows=set_rows/> }.into_view()
            } else {
                view! {
                    <div class="tw-flex tw-justify-center tw-items-center tw-w-full tw-h-full">
                        <div class="tw-w-1/3 tw-bg-white tw-p-4 tw-rounded-2xl tw-border">
                            <h1 class="tw-mb-4">"No table selected"</h1>
                        </div>
                    </div>
                }
                    .into_view()
            }
        }}
    }
}
