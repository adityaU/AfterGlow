use common::models::app_column::TypeValidation;
use leptos::{
    component, create_memo, create_signal, view, watch, IntoView, ReadSignal, SignalGet, SignalSet,
    SignalUpdate, WriteSignal,
};
use web_sys::{console, wasm_bindgen::JsValue};

use crate::{
    base_comp_attributes, base_comp_attributes_with_options,
    components::base::{input::Input, toggle::Toggle},
    create_derived_memo, create_derived_memo_with_option, create_updater_func,
    create_updater_func_with_option,
};

#[component]
pub fn TypeValidationFormProgressBar(
    tv: ReadSignal<Option<TypeValidation>>,
    set_tv: WriteSignal<Option<TypeValidation>>,
    set_error: WriteSignal<bool>,
) -> impl IntoView {
    let (max, max_updater_func, max_error_message, set_max_error_message) = base_comp_attributes_with_options!(
        tv,
        set_tv,
        TypeValidation::ProgressBar,
        max,
        i32,
        None
    )();
    let (default_local, default_updater_func, default_error_message, set_default_error_message) =
        base_comp_attributes!(tv, set_tv, TypeValidation::ProgressBar, default, None)();

    let (
        decimal_places,
        decimal_places_updater_func,
        decimal_error_message,
        set_decimal_error_message,
    ) = base_comp_attributes_with_options!(
        tv,
        set_tv,
        TypeValidation::ProgressBar,
        decimal_places,
        u32,
        None
    )();

    let (
        allow_decimal,
        allow_decimal_updater_func,
        allow_decimal_error_message,
        set_allow_decimal_error_message,
    ) = base_comp_attributes!(
        tv,
        set_tv,
        TypeValidation::ProgressBar,
        allowed_decimal,
        false
    )();

    let _ = watch(
        move || tv.get(),
        move |new, _, _| {
            if let Some(TypeValidation::ProgressBar {
                default,
                decimal_places,
                max,
                ..
            }) = new
            {
                let mut err = false;
                if decimal_places > &10_u32 {
                    set_decimal_error_message
                        .set(Some("Precision can not be more than 10".to_string()));
                    err = true;
                }

                if let Some(default) = default {
                    if default < &0 {
                        set_default_error_message
                            .set(Some("Negetive Numbers are not allowed".to_string()));
                        err = true;
                    }
                    if default > max {
                        set_default_error_message
                            .set(Some("Default can not be more than max".to_string()));
                        err = true;
                    }
                }

                if err {
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
            label="max".to_string()
            value=max
            input_type="text".to_string()
            set_value=Box::new(max_updater_func)
            error_message=max_error_message
            classes="tw-mb-4".to_string()
        />
        <Toggle
            label="Can have decimal".to_string()
            value=allow_decimal
            set_value=Box::new(allow_decimal_updater_func)
            classes="tw-mb-4".to_string()
        />

        <Input
            label="Decimal Places".to_string()
            value=decimal_places
            input_type="number".to_string()
            set_value=Box::new(decimal_places_updater_func)
            error_message=decimal_error_message
            classes="tw-mb-4".to_string()
        />

        <Input
            label="Default".to_string()
            value=default_local
            input_type="number".to_string()
            set_value=Box::new(default_updater_func)
            error_message=default_error_message
            classes="".to_string()
        />
    }
}
