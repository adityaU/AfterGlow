use common::models::app_column::{DateFormat, TypeValidation};
use leptos::{
    component, create_memo, create_signal, view, IntoView, ReadSignal, SignalGet, SignalUpdate,
    WriteSignal,
};
use web_sys::{console, wasm_bindgen::JsValue};

use crate::{
    components::base::{
        select::{OptionItem, Select},
        toggle::Toggle,
    },
    create_derived_memo, create_derived_memo_with_option, create_updater_func,
    create_updater_func_with_option,
};

#[component]
pub fn TypeValidationFormDate(
    tv: ReadSignal<Option<TypeValidation>>,
    set_tv: WriteSignal<Option<TypeValidation>>,
    set_error: WriteSignal<bool>,
) -> impl IntoView {
    let default_to_current =
        create_derived_memo!(tv, TypeValidation::Date, default_to_current, false);
    let default_to_current_updater_func =
        create_updater_func!(tv, set_tv, TypeValidation::Date, default_to_current);

    let format_local = create_derived_memo_with_option!(
        tv,
        TypeValidation::Date,
        format,
        Some(DateFormat::ISO8601)
    );

    let format_updater_func =
        create_updater_func_with_option!(tv, set_tv, TypeValidation::Date, format, DateFormat);

    let (format_error_message, set_format_error_message) = create_signal(None::<String>);

    let format_options = vec![
        OptionItem {
            value: DateFormat::ISO8601,
            label: DateFormat::ISO8601.label(),
        },
        OptionItem {
            value: DateFormat::RFC2822,
            label: DateFormat::RFC2822.label(),
        },
        OptionItem {
            value: DateFormat::US,
            label: DateFormat::US.label(),
        },
        OptionItem {
            value: DateFormat::UK,
            label: DateFormat::UK.label(),
        },
        OptionItem {
            value: DateFormat::DE,
            label: DateFormat::DE.label(),
        },
        OptionItem {
            value: DateFormat::MonthDayYear,
            label: DateFormat::MonthDayYear.label(),
        },
        OptionItem {
            value: DateFormat::MonthAbbrDayYear,
            label: DateFormat::MonthAbbrDayYear.label(),
        },
        OptionItem {
            value: DateFormat::DayMonthYear,
            label: DateFormat::DayMonthYear.label(),
        },
        OptionItem {
            value: DateFormat::DayMonthAbbrYear,
            label: DateFormat::DayMonthAbbrYear.label(),
        },
    ];

    let format_display_func = move || -> String {
        match tv.get() {
            Some(TypeValidation::Date { format, .. }) => format.label(),
            _ => "Select Date Format".to_string(),
        }
    };

    view! {
        <div class="note tw-mb-2">Use this Column type for numbers including decimal numbers.</div>
        <Toggle
            value=default_to_current
            set_value=Box::new(default_to_current_updater_func)
            label="default to current date".to_string()
            classes="tw-mb-4".to_string()
        />

        <Select
            options=format_options.clone()
            value=format_local
            set_value=Box::new(format_updater_func)
            label="Select Date Format".to_string()
            error_message=format_error_message
            display_func=Box::new(format_display_func)
            classes="tw-mb-4".to_string()
        />
    }
}
