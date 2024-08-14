use std::rc::Rc;

use common::models::app_column::{TypeValidation, VecOrSingle};
use leptos::{
    component, create_memo, create_signal, view, watch, IntoView, ReadSignal, SignalGet, SignalSet,
    SignalUpdate, WriteSignal,
};

use crate::components::base::{
    search_select::{DisplayFunc, OptionsSearchFunc, SearchSelect},
    select::OptionItem,
};

#[component]
pub fn TypeValidationFormSingleSelect(
    tv: ReadSignal<Option<TypeValidation>>,
    set_tv: WriteSignal<Option<TypeValidation>>,
    set_error: WriteSignal<bool>,
) -> impl IntoView {
    let (default_error_message, set_default_error_message) = create_signal(None::<String>);
    let (options_error_message, set_options_error_message) = create_signal(None::<String>);

    let options_memo = create_memo(move |_| {
        if let Some(TypeValidation::SingleSelect { options, .. }) = tv.get() {
            Some(VecOrSingle::Vec(options))
        } else {
            None
        }
    });

    let options_updater_func = move |new_value: Option<VecOrSingle<String>>| {
        if let Some(TypeValidation::SingleSelect { .. }) = tv.get() {
            set_tv.update(|tv| {
                if let Some(TypeValidation::SingleSelect {
                    options: ref mut field_ref,
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

    let add_option_func: OptionsSearchFunc<_, _> = Rc::new(|s: String| {
        Box::pin(async move {
            vec![OptionItem {
                value: s.clone(),
                label: format!("Add - {}", s),
            }]
        })
    });

    let options_display_func: DisplayFunc<_> = Rc::new(|s| {
        Box::pin(async move {
            s.iter()
                .map(|s: &String| (s.clone(), s.clone()))
                .collect::<Vec<(String, _)>>()
        })
    });

    let defaults_memo = create_memo(move |_| {
        if let Some(TypeValidation::SingleSelect { default, .. }) = tv.get() {
            if let Some(default) = default {
                Some(VecOrSingle::Single(default))
            } else {
                None
            }
        } else {
            None
        }
    });

    let default_updater_func = move |new_value: Option<VecOrSingle<String>>| {
        if let Some(TypeValidation::SingleSelect { .. }) = tv.get() {
            set_tv.update(|tv| {
                if let Some(TypeValidation::SingleSelect {
                    default: ref mut field_ref,
                    ..
                }) = tv
                {
                    if let Some(new_value) = new_value {
                        if let VecOrSingle::Single(new_value) = new_value {
                            *field_ref = Some(new_value);
                        }
                    }
                }
            });
        }
    };

    let add_default_func: OptionsSearchFunc<_, _> = Rc::new(move |s: String| {
        let options_memo = options_memo.get();
        Box::pin(async move {
            match options_memo {
                Some(memo) => match memo {
                    VecOrSingle::Vec(options) => {
                        let options = options.clone();
                        options
                            .iter()
                            .filter_map(|o| {
                                if o.contains(&s) {
                                    Some(OptionItem {
                                        value: o.clone(),
                                        label: o.clone(),
                                    })
                                } else {
                                    None
                                }
                            })
                            .collect()
                    }
                    VecOrSingle::Single(_) => vec![],
                },
                None => vec![],
            }
        })
    });

    let default_display_func: DisplayFunc<_> = Rc::new(|s| {
        Box::pin(async move {
            s.iter()
                .map(|s: &String| (s.clone(), s.clone()))
                .collect::<Vec<(String, _)>>()
        })
    });

    let _ = watch(
        move || tv.get(),
        move |new, _, _| {
            if let Some(TypeValidation::SingleSelect {
                default, options, ..
            }) = new
            {
                let mut error = None;
                if let Some(default) = default {
                    if !options.contains(default) {
                        error = Some(format!("Default value {} is not in options", default));
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
        <SearchSelect
            value=options_memo
            set_value=Box::new(options_updater_func)
            label="Options".to_string()
            options_search_func=add_option_func.clone()
            error_message=options_error_message
            display_func=options_display_func.clone()
            is_multiple=true
            placeholder="Add options".to_string()
            classes="tw-mb-4".to_string()
        />

        <SearchSelect
            value=defaults_memo
            set_value=Box::new(default_updater_func)
            label="Default".to_string()
            options_search_func=add_default_func.clone()
            error_message=default_error_message
            display_func=default_display_func.clone()
            is_multiple=false
            placeholder="Add default".to_string()
            classes="".to_string()
        />
    }
}
