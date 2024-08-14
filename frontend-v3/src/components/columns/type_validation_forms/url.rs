use common::models::app_column::TypeValidation;
use leptos::{
    component, create_memo, create_signal, view, watch, IntoView, ReadSignal, SignalGet, SignalSet,
    SignalUpdate, WriteSignal,
};
use web_sys::{console, wasm_bindgen::JsValue};

use crate::{
    components::base::input::Input, create_derived_memo, create_updater_func,
    helpers::url::is_valid_url,
};

#[component]
pub fn TypeValidationFormUrl(
    tv: ReadSignal<Option<TypeValidation>>,
    set_tv: WriteSignal<Option<TypeValidation>>,
    set_error: WriteSignal<bool>,
) -> impl IntoView {
    let default_local = create_derived_memo!(tv, TypeValidation::Url, default, None);
    let (default_error_message, set_default_error_message) = create_signal(None::<String>);

    let default_updater_func = create_updater_func!(tv, set_tv, TypeValidation::Url, default);
    let _ = watch(
        move || tv.get(),
        move |new, _, _| {
            if let Some(TypeValidation::Url {
                default: Some(default),
            }) = new
            {
                if !is_valid_url(default.as_str()) {
                    set_default_error_message.set(Some("Invalid Url".to_string()));
                    set_error.set(true);
                    return;
                }
            }

            set_default_error_message.set(None);
            set_error.set(false);
        },
        true,
    );

    view! {
        <Input
            label="Default".to_string()
            value=default_local
            input_type="text".to_string()
            set_value=Box::new(default_updater_func)
            error_message=default_error_message
            classes="".to_string()
        />
    }
}
