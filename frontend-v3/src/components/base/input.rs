use leptos_use::use_debounce_fn;
use std::{rc::Rc, str::FromStr};

use leptos::{
    component, event_target_value, untrack, view, IntoAttribute, IntoView, Memo, ReadSignal,
    SignalGet, SignalSet,
};

use crate::helpers::parser::parse_string_to_option;

#[component]
pub fn Input<T: Clone + ToString + FromStr + Default + IntoAttribute + PartialEq + 'static>(
    value: Memo<Option<T>>,
    set_value: Box<dyn Fn(Option<T>)>,
    label: String,
    input_type: String,
    error_message: ReadSignal<Option<String>>,
    classes: String,
) -> impl IntoView {
    let (focus, set_focus) = leptos::create_signal(false);

    let set_value = Rc::new(set_value);
    view! {
        <div class=format!("tw-relative {}", classes)>

            <label
                for="name"
                class=move || {
                    let base_classes = "tw-absolute  tw-top-[0.8rem] tw-bg-white tw-px-2 tw-transition-all tw-text-sm tw-font-medium tw-pointer-events-none";
                    let focus_classes = if focus.get()
                        || (value.get().unwrap_or_default() != T::default())
                    {
                        "tw-text-primary tw-transform tw--translate-y-6 tw-scale-75 tw-left-2.5"
                    } else {
                        "tw-left-4"
                    };
                    let error_classes = if error_message.get().is_some() {
                        "tw-text-red-500"
                    } else {
                        "tw-text-default/40"
                    };
                    format!("{} {} {}", base_classes, focus_classes, error_classes)
                }
            >

                {label}
            </label>

            <input
                type=input_type
                value=move || value.get()
                on:input=move |ev| {
                    untrack(|| {
                        let set_value = Rc::clone(&set_value);
                        use_debounce_fn(
                            move || { set_value(parse_string_to_option(event_target_value(&ev))) },
                            500.0,
                        )();
                    })
                }

                on:focus=move |_| set_focus.set(true)
                on:focusout=move |_| set_focus.set(false)

                class=move || {
                    let base_classes = "tw-w-full tw-py-3 tw-px-[1.4rem] tw-border tw-rounded-full tw-bg-white tw-outline-none tw-transition tw-duration-200";
                    let focus_classes = "focus:tw-border-primary focus:tw-ring-2 focus:tw-ring-primary focus:tw-ring-opacity-50";
                    let error_classes = if error_message.get().is_some() {
                        "tw-border-red-500 focus:tw-ring-red-500"
                    } else {
                        "tw-text-default"
                    };
                    format!("{} {} {}", base_classes, focus_classes, error_classes)
                }
            />

            {move || {
                if let Some(ref err) = error_message.get() {
                    view! { <div class="tw-ml-4 tw-text-red-500 tw-text-sm tw-mt-1">{err}</div> }
                        .into_view()
                } else {
                    view! {}.into_view()
                }
            }}

        </div>
    }
}
