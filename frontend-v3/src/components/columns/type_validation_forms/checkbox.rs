use common::models::app_column::{CheckboxStyle, TypeValidation};
use leptos::{
    component, create_memo, create_signal, view, IntoView, ReadSignal, SignalGet, SignalUpdate,
    WriteSignal,
};
use web_sys::console;

use crate::{
    base_comp_attributes, base_comp_attributes_with_options,
    components::base::{
        select::{OptionItem, Select},
        toggle::Toggle,
    },
    create_derived_memo, create_derived_memo_with_option, create_updater_func,
    create_updater_func_with_option,
};

#[component]
pub fn TypeValidationFormCheckbox(
    tv: ReadSignal<Option<TypeValidation>>,
    set_tv: WriteSignal<Option<TypeValidation>>,
    set_error: WriteSignal<bool>,
) -> impl IntoView {
    // Use the base_comp_attributes_with_options macro to generate style and related signals
    let (style, style_updater_func, style_error_message, set_style_error_message) = base_comp_attributes_with_options!(
        tv,
        set_tv,
        TypeValidation::Checkbox,
        style,
        CheckboxStyle,
        None
    )();

    // Function to display the current style as a label
    let style_display_func = move || {
        tv.get().map_or_else(
            || "Pick a style".to_string(),
            |tv| {
                if let TypeValidation::Checkbox { style, .. } = tv {
                    style.label()
                } else {
                    "Pick a style".to_string()
                }
            },
        )
    };

    // Define style options
    let style_options = vec![
        OptionItem {
            value: CheckboxStyle::Tick,
            label: CheckboxStyle::Tick.label(),
        },
        OptionItem {
            value: CheckboxStyle::Circle,
            label: CheckboxStyle::Circle.label(),
        },
        OptionItem {
            value: CheckboxStyle::Heart,
            label: CheckboxStyle::Heart.label(),
        },
        OptionItem {
            value: CheckboxStyle::Toggle,
            label: CheckboxStyle::Toggle.label(),
        },
    ];

    // Generate signals for default settings
    let (default_local, default_updater_func, default_error_message, set_default_error_message) =
        base_comp_attributes!(tv, set_tv, TypeValidation::Checkbox, default, false)();

    view! {
        <Select
            value=style
            options=style_options.clone()
            set_value=Box::new(style_updater_func.clone())
            label="Style".to_string()
            error_message=style_error_message.clone()
            display_func=Box::new(style_display_func.clone())
            classes="tw-mb-4".to_string()
        />

        <Toggle
            label="Default".to_string()
            value=default_local.clone()
            set_value=Box::new(default_updater_func.clone())
            classes="".to_string()
        />
    }
}
