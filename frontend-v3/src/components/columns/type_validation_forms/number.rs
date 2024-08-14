use common::models::app_column::{NumberFormats, TypeValidation};
use leptos::{
    component, create_memo, create_signal, view, watch, IntoView, ReadSignal, SignalGet, SignalSet,
    SignalUpdate, WriteSignal,
};

use crate::{
    base_comp_attributes,
    components::{
        base::{input::Input, select::Select, toggle::Toggle},
        columns::type_validation_forms::common::number_format_options,
    },
    create_derived_memo, create_derived_memo_with_option, create_updater_func,
    create_updater_func_with_option,
};

#[component]
pub fn TypeValidationFormNumber(
    tv: ReadSignal<Option<TypeValidation>>,
    set_tv: WriteSignal<Option<TypeValidation>>,
    set_error: WriteSignal<bool>,
) -> impl IntoView {
    let is_integer_local = create_derived_memo!(tv, TypeValidation::Number, is_integer, false);
    let is_integer_local_updater_func =
        create_updater_func!(tv, set_tv, TypeValidation::Number, is_integer);

    let allow_negetive_local =
        create_derived_memo!(tv, TypeValidation::Number, allow_negetive, false);
    let allow_negetive_local_updater_func =
        create_updater_func!(tv, set_tv, TypeValidation::Number, allow_negetive);

    let precision_local = create_derived_memo!(tv, TypeValidation::Number, precision, None);
    let precision_local_updater_func =
        create_updater_func!(tv, set_tv, TypeValidation::Number, precision);
    let (precision_error_message, set_precision_error_message) = create_signal(None::<String>);

    let format_local = create_derived_memo_with_option!(
        tv,
        TypeValidation::Number,
        format,
        Some(NumberFormats::NoSeperator)
    );
    let format_updater_func =
        create_updater_func_with_option!(tv, set_tv, TypeValidation::Number, format, NumberFormats);

    let (format_error_message, set_format_error_message) = create_signal(None::<String>);

    let format_display_func = move || -> String {
        match tv.get() {
            Some(TypeValidation::Number { format, .. }) => format.label(),
            _ => "Select Number Format".to_string(),
        }
    };
    let (default, default_updater_func, default_error_message, set_default_error_message) =
        base_comp_attributes!(tv, set_tv, TypeValidation::Number, default, None)();

    let _ = watch(
        move || tv.get(),
        move |new, _, _| {
            if let Some(TypeValidation::Number {
                default,
                allow_negetive,
                precision,
                ..
            }) = new
            {
                let mut err = false;
                if let Some(precision) = precision {
                    if precision > &10_u8 {
                        set_precision_error_message
                            .set(Some("Precision can not be more than 10".to_string()));
                        err = true;
                    }
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
        <div class="note tw-mb-2">Use this Column type for numbers including decimal numbers.</div>
        <Select
            options=number_format_options()
            value=format_local
            set_value=Box::new(format_updater_func)
            label="Select Number Format".to_string()
            error_message=format_error_message
            display_func=Box::new(format_display_func)
            classes="tw-mb-4".to_string()
        />
        <Toggle
            value=allow_negetive_local
            set_value=Box::new(allow_negetive_local_updater_func)
            label="Allow Negetive Numbers".to_string()
            classes="tw-mb-4".to_string()
        />

        <Toggle
            value=is_integer_local
            set_value=Box::new(is_integer_local_updater_func)
            label="Only Integers (Can not have decimal)".to_string()
            classes="tw-mb-4".to_string()
        />
        {move || {
            if !is_integer_local.get() {
                view! {
                    <Input
                        label="Precision".to_string()
                        value=precision_local
                        input_type="number".to_string()
                        set_value=Box::new(precision_local_updater_func)
                        error_message=precision_error_message
                        classes="tw-mb-4".to_string()
                    />
                }
                    .into_view()
            } else {
                view! {}.into_view()
            }
        }}

        <Input
            label="Default Value".to_string()
            value=default
            input_type="number".to_string()
            set_value=Box::new(default_updater_func)
            error_message=default_error_message
            classes="".to_string()
        />
    }
}
