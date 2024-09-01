use std::rc::Rc;

use leptos::{
    component, create_effect, create_node_ref, create_signal, html::Div, view, IntoView, Memo,
    ReadSignal, Show, SignalGet, SignalSet,
};
use serde::{Deserialize, Serialize};
use web_sys::{
    wasm_bindgen::{closure::Closure, JsCast},
    Node,
};

use crate::helpers::click_outside::hide_on_click_outside;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct OptionItem<V, L> {
    pub value: V,
    pub label: L,
}

impl<V, L> OptionItem<V, L> {
    pub fn new(value: V, label: L) -> Self {
        Self { value, label }
    }
}

#[component]
pub fn Select<V: Clone + PartialEq + Default + 'static, L: Clone + ToString + Default + 'static>(
    options: Vec<OptionItem<V, L>>,
    value: Memo<Option<V>>,
    set_value: Box<dyn Fn(Option<V>)>,
    error_message: ReadSignal<Option<String>>,
    label: String,
    display_func: Box<dyn Fn() -> String>,
    classes: String,
) -> impl IntoView {
    let (is_open, set_is_open) = create_signal(false);
    let toggle_dropdown = move |_| set_is_open.set(!is_open.get());
    let element_ref = create_node_ref::<Div>();

    let handle_select = Rc::new(move |value: Option<V>| {
        set_value(value.clone());
        set_is_open.set(false);
    });

    // Set up the event listener for document clicks
    create_effect(move |_| hide_on_click_outside(&element_ref, set_is_open));
    view! {
        <div class=format!("{} tw-relative", classes) ref=element_ref>
            <label
                for="select"
                class=move || {
                    let base_classes = "tw-absolute tw-top-[0.8rem] tw-bg-white tw-px-2 tw-transition-all tw-text-sm tw-font-medium tw-pointer-events-none";
                    let focus_classes = if is_open.get() || value.get().is_some() {
                        "tw-text-primary tw-transform tw--translate-y-6 tw-scale-75 tw-left-[-1px]"
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

            <div
                class=move || {
                    let base_classes = "tw-w-full tw-py-3 tw-px-[1.3rem] tw-border tw-bg-white tw-outline-none tw-transition tw-duration-200 tw-cursor-pointer";
                    let focus_classes = if is_open.get() {
                        "tw-border-primary tw-ring-2 tw-ring-primary tw-ring-opacity-50"
                    } else {
                        ""
                    };
                    let error_classes = if error_message.get().is_some() {
                        "tw-border-red-500 focus:tw-ring-red-500"
                    } else {
                        "tw-text-default/80"
                    };
                    let open_classes = if is_open.get() {
                        "tw-rounded-t-2xl tw-border-b-0"
                    } else {
                        "tw-rounded-full"
                    };
                    format!("{} {} {} {}", base_classes, focus_classes, error_classes, open_classes)
                }

                on:click=toggle_dropdown
            >
                <Show
                    when=move || { value.get().is_some() }
                    fallback=move || {
                        view! { <div class="tw-text-transparent">c</div> }
                    }
                >

                    <span class="tw-text-default">{display_func()}</span>
                </Show>
            </div>

            <div class=move || {
                let base_classes = "tw-absolute tw-left-0 tw-right-0 tw-border tw-rounded-b-2xl tw-bg-white tw-z-10 tw-transition-all tw-duration-300 tw-ease-in-out tw-overflow-auto tw-shadow-lg tw-mt-1";
                let open_classes = if is_open.get() {
                    "tw-border-primary tw-ring-2 tw-ring-primary tw-ring-opacity-50 tw-max-h-60 tw-opacity-100 tw-border-primary tw-border-t-0"
                } else {
                    "tw-max-h-0 tw-opacity-0 tw-pointer-events-none"
                };
                format!("{} {}", base_classes, open_classes)
            }>

                {options
                    .into_iter()
                    .map(move |option| {
                        let value = option.value.clone();
                        let handle_select = handle_select.clone();
                        view! {
                            <div
                                class="tw-px-4 tw-py-2 tw-cursor-pointer hover:tw-bg-primary last:tw-rounded-b-2xl hover:tw-text-text-onprimary"
                                on:click=move |_| handle_select(Some(value.clone()))
                            >
                                {option.label.clone().to_string()}
                            </div>
                        }
                    })
                    .collect::<Vec<_>>()}
            </div>

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
