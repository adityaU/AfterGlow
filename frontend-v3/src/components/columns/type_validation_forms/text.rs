use common::models::app_column::TypeValidation;
use leptos::{
    component, create_memo, create_signal, view, watch, IntoView, ReadSignal, Show, SignalGet,
    SignalSet, SignalUpdate, WriteSignal,
};
use web_sys::{console, wasm_bindgen::JsValue};

use crate::{
    components::base::{input::Input, toggle::Toggle},
    create_derived_memo, create_updater_func,
};

#[component]
pub fn TypeValidationFormText(
    tv: ReadSignal<Option<TypeValidation>>,
    set_tv: WriteSignal<Option<TypeValidation>>,
    set_error: WriteSignal<bool>,
) -> impl IntoView {
    let max_length = create_derived_memo!(tv, TypeValidation::Text, max_length, None);
    let max_length_updater_func =
        create_updater_func!(tv, set_tv, TypeValidation::Text, max_length);

    let min_length = create_derived_memo!(tv, TypeValidation::Text, min_length, None);
    let min_length_updater_func =
        create_updater_func!(tv, set_tv, TypeValidation::Text, min_length);

    let enable_rich_formatting =
        create_derived_memo!(tv, TypeValidation::Text, enable_rich_formatting, false);
    let enable_rich_formatting_updater_func =
        create_updater_func!(tv, set_tv, TypeValidation::Text, enable_rich_formatting);

    let default_local = create_derived_memo!(tv, TypeValidation::Text, default, None);
    let (default_error_message, set_default_error_message) = create_signal(None::<String>);
    let (min_length_error_message, set_min_length_error_message) = create_signal(None::<String>);
    let (max_length_error_message, set_max_length_error_message) = create_signal(None::<String>);

    let default_updater_func = create_updater_func!(tv, set_tv, TypeValidation::Text, default);

    let _ = watch(
        move || tv.get(),
        move |new, _, _| {
            if let Some(TypeValidation::Text {
                default,
                min_length,
                max_length,
                ..
            }) = new
            {
                let mut error = None;
                if let Some(default) = default {
                    if let Some(min_length) = min_length {
                        if &(default.len() as u64) < min_length {
                            error = Some("Default value is too short".to_string());
                        }
                    }
                    if let Some(max_length) = max_length {
                        if &(default.len() as u64) > max_length {
                            error = Some("Default value is too long".to_string());
                        }
                    }
                }
                set_default_error_message.set(error.clone());
                if error.is_some() {
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
        <div class="note tw-mb-2">Free text type, useful for names,description, notes etc.</div>
        <Toggle
            value=enable_rich_formatting
            set_value=Box::new(enable_rich_formatting_updater_func)
            label="Enable rich formatting".to_string()
            classes="tw-mb-4".to_string()
        />

        <Input
            label="Minimum Number of Characters".to_string()
            value=min_length
            input_type="number".to_string()
            set_value=Box::new(min_length_updater_func)
            error_message=min_length_error_message
            classes="tw-mb-4".to_string()
        />

        <Input
            label="Maximum Number of Characters".to_string()
            value=max_length
            input_type="number".to_string()
            set_value=Box::new(max_length_updater_func)
            error_message=max_length_error_message
            classes="tw-mb-4".to_string()
        />

        <Input
            label="Default Value".to_string()
            value=default_local
            input_type="text".to_string()
            set_value=Box::new(default_updater_func)
            error_message=default_error_message
            classes="".to_string()
        />
    }
}
