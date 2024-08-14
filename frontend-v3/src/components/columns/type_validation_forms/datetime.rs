use common::models::app_column::{DateTimeFormat, TypeValidation};
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
pub fn TypeValidationFormDateTime(
    tv: ReadSignal<Option<TypeValidation>>,
    set_tv: WriteSignal<Option<TypeValidation>>,
    set_error: WriteSignal<bool>,
) -> impl IntoView {
    let default_to_current =
        create_derived_memo!(tv, TypeValidation::DateTime, default_to_current, false);
    let default_to_current_updater_func =
        create_updater_func!(tv, set_tv, TypeValidation::DateTime, default_to_current);

    let format_local = create_derived_memo_with_option!(
        tv,
        TypeValidation::DateTime,
        format,
        Some(DateTimeFormat::ISO8601)
    );

    let format_updater_func = create_updater_func_with_option!(
        tv,
        set_tv,
        TypeValidation::DateTime,
        format,
        DateTimeFormat
    );

    let (format_error_message, set_format_error_message) = create_signal(None::<String>);

    let format_options = vec![
        OptionItem {
            value: DateTimeFormat::ISO8601,
            label: DateTimeFormat::ISO8601.label(),
        },
        OptionItem {
            value: DateTimeFormat::ISO8601AMPM,
            label: DateTimeFormat::ISO8601AMPM.label(),
        },
        OptionItem {
            value: DateTimeFormat::US,
            label: DateTimeFormat::US.label(),
        },
        OptionItem {
            value: DateTimeFormat::UK,
            label: DateTimeFormat::UK.label(),
        },
        OptionItem {
            value: DateTimeFormat::UKAMPM,
            label: DateTimeFormat::UKAMPM.label(),
        },
        OptionItem {
            value: DateTimeFormat::DE,
            label: DateTimeFormat::DE.label(),
        },
        OptionItem {
            value: DateTimeFormat::DEAMPM,
            label: DateTimeFormat::DEAMPM.label(),
        },
        OptionItem {
            value: DateTimeFormat::MonthDayYearTime,
            label: DateTimeFormat::MonthDayYearTime.label(),
        },
        OptionItem {
            value: DateTimeFormat::MonthDayYearTimeAMPM,
            label: DateTimeFormat::MonthDayYearTimeAMPM.label(),
        },
        OptionItem {
            value: DateTimeFormat::MonthAbbrDayYearTime,
            label: DateTimeFormat::MonthAbbrDayYearTime.label(),
        },
        OptionItem {
            value: DateTimeFormat::MonthAbbrDayYearTimeAMPM,
            label: DateTimeFormat::MonthAbbrDayYearTimeAMPM.label(),
        },
        OptionItem {
            value: DateTimeFormat::DayMonthYearTime,
            label: DateTimeFormat::DayMonthYearTime.label(),
        },
        OptionItem {
            value: DateTimeFormat::DayMonthYearTimeAMPM,
            label: DateTimeFormat::DayMonthYearTimeAMPM.label(),
        },
        OptionItem {
            value: DateTimeFormat::DayMonthAbbrYearTime,
            label: DateTimeFormat::DayMonthAbbrYearTime.label(),
        },
        OptionItem {
            value: DateTimeFormat::DayMonthAbbrYearTimeAMPM,
            label: DateTimeFormat::DayMonthAbbrYearTimeAMPM.label(),
        },
    ];

    let format_display_func = move || -> String {
        match tv.get() {
            Some(TypeValidation::DateTime { format, .. }) => format.label(),
            _ => "Select Date & Time Format".to_string(),
        }
    };

    view! {
        <div class="note tw-mb-2">Use this Column type for numbers including decimal numbers.</div>
        <Toggle
            value=default_to_current
            set_value=Box::new(default_to_current_updater_func)
            label="default to current date & Time".to_string()
            classes="tw-mb-4".to_string()
        />

        <Select
            options=format_options.clone()
            value=format_local
            set_value=Box::new(format_updater_func)
            label="Select Date Format".to_string()
            error_message=format_error_message
            display_func=Box::new(format_display_func)
            classes="".to_string()
        />
    }
}
