use common::models::app_column::{NumberFormats, PercentDisplayOptions, TypeValidation};
use leptos::{
    component, create_memo, create_signal, view, watch, IntoView, ReadSignal, SignalGet, SignalSet,
    SignalUpdate, WriteSignal,
};
use web_sys::{console, wasm_bindgen::JsValue};

use crate::{
    base_comp_attributes, base_comp_attributes_with_options,
    components::{
        base::{
            input::Input,
            select::{OptionItem, Select},
            toggle::Toggle,
        },
        columns::type_validation_forms::common::number_format_options,
    },
    create_derived_memo, create_derived_memo_with_option, create_updater_func,
    create_updater_func_with_option,
};

#[component]
pub fn TypeValidationFormPercentage(
    tv: ReadSignal<Option<TypeValidation>>,
    set_tv: WriteSignal<Option<TypeValidation>>,
    set_error: WriteSignal<bool>,
) -> impl IntoView {
    let (default_local, default_updater_func, default_error_message, set_default_error_message) =
        base_comp_attributes!(tv, set_tv, TypeValidation::Percentage, default, None)();

    let (
        decimal_places,
        decimal_places_updater_func,
        decimal_error_message,
        set_decimal_error_message,
    ) = base_comp_attributes_with_options!(
        tv,
        set_tv,
        TypeValidation::Percentage,
        decimal_places,
        u32,
        None
    )();

    let (
        allow_negetive,
        allow_negetive_updater_func,
        allow_negetive_error_message,
        set_allow_negetive_error_message,
    ) = base_comp_attributes!(
        tv,
        set_tv,
        TypeValidation::Percentage,
        allow_negetive,
        false
    )();

    let (format, format_updater_func, format_error_message, set_format_error_message) = base_comp_attributes_with_options!(
        tv,
        set_tv,
        TypeValidation::Percentage,
        format,
        NumberFormats,
        None
    )();

    let format_display_func = move || -> String {
        match tv.get() {
            Some(TypeValidation::Percentage { format, .. }) => format.label(),
            _ => "Select Number Format".to_string(),
        }
    };

    let percentage_display_options = vec![
        OptionItem {
            value: PercentDisplayOptions::Bar,
            label: PercentDisplayOptions::Bar.label(),
        },
        OptionItem {
            value: PercentDisplayOptions::None,
            label: PercentDisplayOptions::None.label(),
        },
        OptionItem {
            value: PercentDisplayOptions::Circle,
            label: PercentDisplayOptions::Circle.label(),
        },
    ];

    let (
        percent_display,
        percent_display_updater_func,
        percent_display_error_message,
        set_percent_display_error_message,
    ) = base_comp_attributes_with_options!(
        tv,
        set_tv,
        TypeValidation::Percentage,
        display_as,
        PercentDisplayOptions,
        None
    )();

    let percent_display_display_func = move || -> String {
        match tv.get() {
            Some(TypeValidation::Percentage { display_as, .. }) => display_as.label(),
            _ => "Select Number Format".to_string(),
        }
    };

    let _ = watch(
        move || tv.get(),
        move |new, _, _| {
            if let Some(TypeValidation::Percentage {
                default,
                allow_negetive,
                decimal_places,
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
                    if !allow_negetive {
                        if let Ok(default) = default.parse::<f64>() {
                            if default < 0.0 {
                                set_default_error_message
                                    .set(Some("Negetive Numbers are not allowed".to_string()));
                                err = true;
                            }
                        } else {
                            set_default_error_message.set(Some("Invalid Number".to_string()));
                            err = true;
                        }
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
        <Toggle
            label="Allow Negative".to_string()
            value=allow_negetive
            set_value=Box::new(allow_negetive_updater_func)
            classes="tw-mb-4".to_string()
        />

        <Select
            options=number_format_options()
            value=format
            set_value=Box::new(format_updater_func)
            label="Select Format".to_string()
            error_message=format_error_message
            display_func=Box::new(format_display_func)
            classes="tw-mb-4".to_string()
        />

        <Input
            label="Precision".to_string()
            value=decimal_places
            input_type="number".to_string()
            set_value=Box::new(decimal_places_updater_func)
            error_message=decimal_error_message
            classes="tw-mb-4".to_string()
        />

        <Select
            options=percentage_display_options.clone()
            value=percent_display
            set_value=Box::new(percent_display_updater_func)
            label="Select Display Type".to_string()
            error_message=percent_display_error_message
            display_func=Box::new(percent_display_display_func)
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
