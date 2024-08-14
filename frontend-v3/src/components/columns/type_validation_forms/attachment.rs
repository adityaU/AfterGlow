use std::rc::Rc;

use common::models::app_column::{TypeValidation, VecOrSingle};
use leptos::{
    component, create_memo, create_signal, view, IntoView, ReadSignal, SignalGet, SignalUpdate,
    WriteSignal,
};
use web_sys::{console, wasm_bindgen::JsValue};

use crate::{
    base_comp_attributes,
    components::base::{
        input::Input,
        search_select::{DisplayFunc, OptionsSearchFunc, SearchSelect},
        select::OptionItem,
    },
    create_derived_memo, create_updater_func,
};

#[component]
pub fn TypeValidationFormAttachment(
    tv: ReadSignal<Option<TypeValidation>>,
    set_tv: WriteSignal<Option<TypeValidation>>,
    set_error: WriteSignal<bool>,
) -> impl IntoView {
    let default_local = create_derived_memo!(tv, TypeValidation::Attachment, default, None);
    let (default_error_message, set_default_error_message) = create_signal(None::<String>);

    let default_updater_func =
        create_updater_func!(tv, set_tv, TypeValidation::Attachment, default);

    let (max_size, max_size_updater, max_size_error_message, set_max_size_error_message) =
        base_comp_attributes!(tv, set_tv, TypeValidation::Attachment, max_size, None)();

    let possible_ext_memo = create_memo(move |_| {
        if let Some(TypeValidation::Attachment {
            possible_extensions,
            ..
        }) = tv.get()
        {
            Some(VecOrSingle::Vec(possible_extensions))
        } else {
            None
        }
    });

    let possible_ext_updater_func = move |new_value: Option<VecOrSingle<String>>| {
        if let Some(TypeValidation::Attachment { .. }) = tv.get() {
            set_tv.update(|tv| {
                if let Some(TypeValidation::Attachment {
                    possible_extensions: ref mut field_ref,
                    ..
                }) = tv
                {
                    if let Some(new_value) = new_value {
                        if let VecOrSingle::Vec(new_value) = new_value {
                            *field_ref = new_value;
                        }
                    }
                }
            });
        }
    };

    let add_possible_ext_func: OptionsSearchFunc<_, _> = Rc::new(|s: String| {
        Box::pin(async move {
            vec![OptionItem {
                value: s.clone(),
                label: format!("Add - {}", s),
            }]
        })
    });

    let possible_ext_display_func: DisplayFunc<_> = Rc::new(|s| {
        Box::pin(async move {
            s.iter()
                .map(|s: &String| (s.clone(), s.clone()))
                .collect::<Vec<(String, _)>>()
        })
    });
    let (possible_ext_error_message, set_possible_ext_error_message) =
        create_signal(None::<String>);

    view! {
        <SearchSelect
            value=possible_ext_memo
            set_value=Box::new(possible_ext_updater_func)
            label="Allowed Extensions".to_string()
            options_search_func=add_possible_ext_func.clone()
            error_message=possible_ext_error_message
            display_func=possible_ext_display_func.clone()
            is_multiple=true
            placeholder="Add Allowed Extensions".to_string()
            classes="tw-mb-4".to_string()
        />

        <Input
            label="Max Size in MB".to_string()
            value=max_size
            input_type="number".to_string()
            set_value=Box::new(max_size_updater)
            error_message=max_size_error_message
            classes="tw-mb-4".to_string()
        />

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
