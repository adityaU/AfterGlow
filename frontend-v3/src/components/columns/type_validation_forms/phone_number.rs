use common::models::app_column::TypeValidation;
use leptos::{
    component, create_memo, create_signal, view, IntoView, ReadSignal, SignalGet, SignalUpdate,
    WriteSignal,
};

use crate::{components::base::input::Input, create_derived_memo, create_updater_func};

#[component]
pub fn TypeValidationFormPhoneNumber(
    tv: ReadSignal<Option<TypeValidation>>,
    set_tv: WriteSignal<Option<TypeValidation>>,
    set_error: WriteSignal<bool>,
) -> impl IntoView {
    let default_local = create_derived_memo!(tv, TypeValidation::PhoneNumber, default, None);
    let (default_error_message, set_default_error_message) = create_signal(None::<String>);

    let default_updater_func =
        create_updater_func!(tv, set_tv, TypeValidation::PhoneNumber, default);

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
