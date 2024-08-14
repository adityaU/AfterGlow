use std::rc::Rc;

use common::models::app_column::TypeValidation;
use leptos::{
    component, create_memo, create_signal, view, IntoView, ReadSignal, SignalGet, SignalUpdate,
    WriteSignal,
};
use web_sys::{console, wasm_bindgen::JsValue};

use crate::{
    apis::user::{find_by_ids, search},
    base_comp_attributes,
    components::base::{
        search_select::{DisplayFunc, OptionsSearchFunc, SearchSelect},
        select::OptionItem,
        toggle::Toggle,
    },
    create_derived_memo, create_updater_func,
};

#[component]
pub fn TypeValidationFormUser(
    tv: ReadSignal<Option<TypeValidation>>,
    set_tv: WriteSignal<Option<TypeValidation>>,
    set_error: WriteSignal<bool>,
) -> impl IntoView {
    let (
        allow_multiple,
        allow_multiple_updater_func,
        _allow_multiple_error_message,
        _set_allow_multiple_error_message,
    ) = base_comp_attributes!(tv, set_tv, TypeValidation::User, allow_multiple, false)();
    let default_local = create_derived_memo!(tv, TypeValidation::User, default, None);
    let (default_error_message, set_default_error_message) = create_signal(None::<String>);

    let default_updater_func = create_updater_func!(tv, set_tv, TypeValidation::User, default);
    let find_user_func: OptionsSearchFunc<_, _> = Rc::new(|s: String| {
        Box::pin(async move {
            search(s)
                .await
                .unwrap_or_default()
                .iter()
                .map(|u| {
                    console::log_1(&JsValue::from(&format!("u: {:?}", u)));
                    OptionItem::new(
                        u.id,
                        format!(
                            "{} {} - {}",
                            u.first_name.clone().unwrap_or_default(),
                            u.last_name.clone().unwrap_or_default(),
                            u.email
                        ),
                    )
                })
                .collect::<Vec<OptionItem<i64, String>>>()
        })
    });

    let user_display_func: DisplayFunc<_> = Rc::new(|id| {
        Box::pin(async move {
            find_by_ids(id)
                .await
                .unwrap_or_default()
                .iter()
                .map(|u| {
                    (
                        format!(
                            "{} {} - {}",
                            u.first_name.clone().unwrap_or_default(),
                            u.last_name.clone().unwrap_or_default(),
                            u.email
                        ),
                        u.id,
                    )
                })
                .collect::<Vec<(String, _)>>()
        })
    });

    view! {
        <Toggle
            label="Allow Multiple".to_string()
            value=allow_multiple
            set_value=Box::new(allow_multiple_updater_func)
            classes="tw-mb-4".to_string()
        />
        {move || {
            allow_multiple.get();
            view! {
                <SearchSelect
                    value=default_local
                    set_value=Box::new(default_updater_func)
                    label="Default".to_string()
                    options_search_func=find_user_func.clone()
                    error_message=default_error_message
                    display_func=user_display_func.clone()
                    is_multiple=allow_multiple.get()

                    placeholder="Search User".to_string()
                    classes="".to_string()
                />
            }
        }}
    }
}
