use common::models::app_column::{AbbrievationFormat, NumberFormats, TypeValidation};
use leptos::{
    component, create_memo, create_signal, view, watch, IntoView, ReadSignal, SignalGet, SignalSet,
    SignalUpdate, WriteSignal,
};

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
pub fn TypeValidationFormCurrency(
    tv: ReadSignal<Option<TypeValidation>>,
    set_tv: WriteSignal<Option<TypeValidation>>,
    set_error: WriteSignal<bool>,
) -> impl IntoView {
    let (symbol, symbol_updater_func, symbol_error_message, set_symbol_error_message) =
        base_comp_attributes!(tv, set_tv, TypeValidation::Currency, symbol, None)();
    let (default_local, default_updater_func, default_error_message, set_default_error_message) =
        base_comp_attributes!(tv, set_tv, TypeValidation::Currency, default, None)();

    let (
        decimal_places,
        decimal_places_updater_func,
        decimal_error_message,
        set_decimal_error_message,
    ) = base_comp_attributes_with_options!(
        tv,
        set_tv,
        TypeValidation::Currency,
        decimal_places,
        u32,
        None
    )();

    let (
        allow_negetive,
        allow_negetive_updater_func,
        allow_negetive_error_message,
        set_allow_negetive_error_message,
    ) = base_comp_attributes!(tv, set_tv, TypeValidation::Currency, allow_negetive, false)();

    let (format, format_updater_func, format_error_message, set_format_error_message) = base_comp_attributes_with_options!(
        tv,
        set_tv,
        TypeValidation::Currency,
        format,
        NumberFormats,
        None
    )();

    let format_display_func = move || -> String {
        match tv.get() {
            Some(TypeValidation::Currency { format, .. }) => format.label(),
            _ => "Select Number Format".to_string(),
        }
    };

    let abbr_options = vec![
        OptionItem {
            value: AbbrievationFormat::None,
            label: AbbrievationFormat::None.label(),
        },
        OptionItem {
            value: AbbrievationFormat::Billion,
            label: AbbrievationFormat::Billion.label(),
        },
        OptionItem {
            value: AbbrievationFormat::Million,
            label: AbbrievationFormat::Million.label(),
        },
        OptionItem {
            value: AbbrievationFormat::Thousand,
            label: AbbrievationFormat::Thousand.label(),
        },
    ];

    let (abbr, abbr_updater_func, abbr_error_message, set_abbr_error_message) = base_comp_attributes_with_options!(
        tv,
        set_tv,
        TypeValidation::Currency,
        abbreviation,
        AbbrievationFormat,
        None
    )();

    let abbr_display_func = move || -> String {
        match tv.get() {
            Some(TypeValidation::Currency { abbreviation, .. }) => abbreviation.label(),
            _ => "Select Number Format".to_string(),
        }
    };

    let _ = watch(
        move || tv.get(),
        move |new, _, _| {
            if let Some(TypeValidation::Currency {
                default,
                allow_negetive,
                ..
            }) = new
            {
                if !allow_negetive {
                    if let Some(default) = default {
                        if let Ok(default) = default.parse::<f64>() {
                            if default < 0.0 {
                                set_default_error_message
                                    .set(Some("Negetive Numbers are not allowed".to_string()));
                                set_error.set(true);
                                return;
                            }
                        } else {
                            set_default_error_message.set(Some("Invalid Number".to_string()));
                            set_error.set(true);
                            return;
                        }
                    }
                }
            }

            set_default_error_message.set(None);
            set_error.set(false);
        },
        true,
    );

    view! {
        <Input
            label="Symbol".to_string()
            value=symbol
            input_type="text".to_string()
            set_value=Box::new(symbol_updater_func)
            error_message=symbol_error_message
            classes="tw-mb-4".to_string()
        />
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
            label="Decimal Places".to_string()
            value=decimal_places
            input_type="number".to_string()
            set_value=Box::new(decimal_places_updater_func)
            error_message=decimal_error_message
            classes="tw-mb-4".to_string()
        />

        <Select
            options=abbr_options.clone()
            value=abbr
            set_value=Box::new(abbr_updater_func)
            label="Select abbreviation format".to_string()
            error_message=abbr_error_message
            display_func=Box::new(abbr_display_func)
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
