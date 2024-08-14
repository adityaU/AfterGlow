use leptos::{
    component, create_effect, create_node_ref, create_resource, create_signal, event_target_value,
    html::{Div, Input},
    store_value, view, For, IntoView, Memo, ReadSignal, Show, SignalGet, SignalSet,
};
use leptos_icons::Icon;
use leptos_use::use_debounce_fn;
use serde::{de::DeserializeOwned, Serialize};
use std::{future::Future, pin::Pin, rc::Rc};
use web_sys::{
    wasm_bindgen::{closure::Closure, JsCast},
    HtmlDivElement, HtmlElement, Node,
};

use common::models::app_column::VecOrSingle;

use crate::helpers::vec::Uniqueable;
use icondata as i;

use super::select::OptionItem;
pub type OptionsSearchFunc<V, L> =
    Rc<dyn Fn(String) -> Pin<Box<dyn Future<Output = Vec<OptionItem<V, L>>>>>>;

pub type DisplayFunc<V> = Rc<dyn Fn(Vec<V>) -> Pin<Box<dyn Future<Output = Vec<(String, V)>>>>>;

#[component]
pub fn SearchSelect<
    V: Clone + PartialEq + Serialize + Eq + std::hash::Hash + DeserializeOwned + 'static,
    L: Clone + ToString + Serialize + DeserializeOwned + 'static,
>(
    options_search_func: OptionsSearchFunc<V, L>,
    value: Memo<Option<VecOrSingle<V>>>,
    set_value: Box<dyn Fn(Option<VecOrSingle<V>>)>,
    error_message: ReadSignal<Option<String>>,
    label: String,
    display_func: DisplayFunc<V>,
    placeholder: String,
    #[prop(optional)] is_multiple: bool,
    classes: String,
) -> impl IntoView {
    let input_ref = create_node_ref::<Input>();
    let (is_open, set_is_open) = create_signal(false);
    let (query, set_query) = create_signal("".to_string());
    let toggle_dropdown = move |_| {
        set_is_open.set(!is_open.get());
        if let Some(input_ref) = input_ref.get() {
            let _ = input_ref.focus();
            let length = query.get().len() as u32; // Get the length of the input value
            input_ref.set_selection_range(length, length).unwrap();
        }
    };

    let set_value = Rc::new(set_value);
    let set_value_clone = set_value.clone();
    let element_ref = create_node_ref::<Div>();

    // Set up the event listener for document clicks
    create_effect(move |_| {
        let element = element_ref.get().unwrap();

        let handle_click_outside = Closure::wrap(Box::new(move |event: web_sys::MouseEvent| {
            if let Some(target) = event.target() {
                if let Some(target_node) = target.dyn_into::<Node>().ok() {
                    if !element.contains(Some(&target_node)) {
                        set_is_open.set(false);
                    }
                }
            }
        }) as Box<dyn FnMut(_)>);

        web_sys::window()
            .unwrap()
            .add_event_listener_with_callback(
                "click",
                handle_click_outside.as_ref().unchecked_ref(),
            )
            .unwrap();

        // Cleanup the event listener when the component is destroyed
        move || {
            web_sys::window()
                .unwrap()
                .remove_event_listener_with_callback(
                    "click",
                    handle_click_outside.as_ref().unchecked_ref(),
                )
                .unwrap();
            handle_click_outside.forget();
        }
    });

    let remove_select = store_value(move |selected: V| match is_multiple {
        true => match value.get() {
            Some(v) => match v {
                VecOrSingle::Vec(mut vec) => {
                    vec.retain(|x| x != &selected);
                    set_value_clone(Some(VecOrSingle::Vec(vec)))
                }
                VecOrSingle::Single(single) => {
                    set_value_clone(Some(VecOrSingle::Vec(vec![single])))
                }
            },
            None => set_value_clone(Some(VecOrSingle::Vec(vec![]))),
        },
        false => set_value_clone(None),
    });

    let handle_select = store_value(move |selected: V| {
        match is_multiple {
            true => match value.get() {
                Some(v) => match v {
                    VecOrSingle::Vec(mut vec) => {
                        vec.push(selected);
                        vec = vec.unique();
                        set_value(Some(VecOrSingle::Vec(vec)))
                    }
                    VecOrSingle::Single(single) => {
                        let v = vec![single, selected].unique();
                        set_value(Some(VecOrSingle::Vec(v)))
                    }
                },
                None => set_value(Some(VecOrSingle::Vec(vec![selected]))),
            },
            false => set_value(Some(VecOrSingle::Single(selected))),
        }
        set_is_open.set(false);
    });

    let options = create_resource(
        move || query.get(),
        move |query| {
            let search_func = options_search_func.clone();
            async move {
                let resp = search_func(query.clone()).await;
                if let Some(input_ref) = input_ref.get() {
                    let _ = input_ref.focus();
                    let length = query.len() as u32; // Get the length of the input value
                    input_ref.set_selection_range(length, length).unwrap();
                }
                resp
            }
        },
    );

    let display = create_resource(
        move || value.get(),
        move |value| {
            let display_func = display_func.clone();
            async move {
                if let Some(value) = value {
                    match value {
                        VecOrSingle::Vec(vec) => display_func(vec).await,
                        VecOrSingle::Single(value) => display_func(vec![value]).await,
                    }
                } else {
                    vec![]
                }
            }
        },
    );

    let display_multiple_view = move || {
        view! {
            <For
                each=move || { display.get().unwrap_or_default() }
                key=move |value| { value.clone() }
                let:value
            >
                <div class="tw-flex tw-items-center tw-gap-2 tw-text-default tw-border-primary tw-bg-primary tw-text-text-onprimary tw-rounded-full tw-px-2 tw-py-1">
                    {value.0}
                    <Icon
                        on:click=move |ev| {
                            ev.stop_propagation();
                            remove_select.with_value(|v| v(value.1.clone()))
                        }

                        icon=i::TbX
                        class="tw-h-[15px] tw-w-[15px] tw-stroke-text-onprimary tw-fill-text-onprimary tw-cursor-pointer"
                    />
                </div>
            </For>
        }
        .into_view()
    };

    let display_single_view = move || {
        if let Some((first_display_val, _)) = display.get().unwrap_or_default().first() {
            view! { <span class="tw-text-default">{first_display_val}</span> }.into_view()
        } else {
            view! {}.into_view()
        }
    };

    view! {
        <div class=format!("{} tw-relative", classes) ref=element_ref>
            <label
                for="name"
                class=move || {
                    let base_classes = "tw-absolute tw-left-2.5 tw-transition-all tw-duration-200 tw-ease-in-out tw-pointer-events-none";
                    let focus_classes = if is_open.get() || value.get().is_some() {
                        "tw-text-primary tw-transform tw--translate-y-3 tw-scale-75 tw-px-2 tw-bg-white"
                    } else {
                        "tw-top-1/2 tw-transform tw--translate-y-1/2 tw-left-6 tw-text-default/40"
                    };
                    let error_classes = if error_message.get().is_some() {
                        "tw-text-red-500"
                    } else {
                        ""
                    };
                    format!("{} {} {}", base_classes, focus_classes, error_classes)
                }
            >

                {label}
            </label>
            <div
                class=move || {
                    let base_classes = "tw-w-full tw-py-3 tw-px-[1.4rem] tw-border tw-bg-white tw-outline-none tw-transition tw-duration-200 tw-cursor-pointer";
                    let focus_classes = if is_open.get() {
                        "tw-border-primary tw-ring-2 tw-ring-primary tw-ring-opacity-50"
                    } else {
                        ""
                    };
                    let error_classes = if error_message.get().is_some() {
                        "tw-border-red-500 focus:tw-ring-red-500"
                    } else {
                        "tw-border"
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
                <div class="tw-flex tw-flex-wrap tw-gap-2">
                    <Show
                        when=move || {
                            !display.get().unwrap_or_default().is_empty() || is_open.get()
                        }

                        fallback=move || {
                            view! { <Placeholder text=placeholder.clone()/> }
                        }
                    >

                        {move || match (is_multiple, is_open.get()) {
                            (true, _) => view! { {display_multiple_view()} }.into_view(),
                            (false, true) => view! {}.into_view(),
                            (false, false) => view! { {display_single_view()} }.into_view(),
                        }}

                    </Show>
                    <Show
                        when=move || is_open.get()
                        fallback=move || {
                            view! {}
                        }
                    >

                        <input
                            type="text"
                            value=query.get()
                            on:click=|ev| ev.stop_propagation()
                            on:input=move |ev| {
                                use_debounce_fn(
                                    move || { set_query.set(event_target_value(&ev)) },
                                    500.0,
                                )();
                            }

                            node_ref=input_ref
                            class="tw-flex-grow tw-outline-none"
                        />
                    </Show>

                </div>
            </div>
            <div class=move || {
                let base_classes = "tw-absolute tw-left-0 tw-right-0 tw-border tw-rounded-b-2xl tw-bg-white tw-z-10 tw-overflow-hidden tw-transition-all tw-duration-300 tw-shadow-lg";
                if is_open.get() {
                    format!(
                        "{} tw-max-h-[300px] tw-opacity-100 tw-border-primary tw-border-t-0 tw-border-primary tw-ring-2 tw-ring-primary tw-ring-opacity-50",
                        base_classes,
                    )
                } else {
                    format!("{} tw-max-h-0 tw-opacity-0 tw-pointer-events-none", base_classes)
                }
            }>
                <Show
                    when=move || !options.loading().get()
                    fallback=|| {
                        view! {
                            <div class="tw-px-4 tw-py-2 tw-cursor-pointer last:tw-rounded-b-2xl hover:tw-text-text-onprimary tw-border-b last:tw-border-b-0">
                                "Loading..."
                            </div>
                        }
                    }
                >

                    {move || {
                        if options.get().unwrap_or_default().is_empty() {
                            view! {
                                <div class="tw-p-2 tw-cursor-pointer hover:tw-bg-primary last:tw-rounded-b-2xl hover:tw-text-text-onprimary">
                                    No records found
                                </div>
                            }
                                .into_view()
                        } else {
                            view! {
                                <For
                                    each=move || { options.get().unwrap_or_default() }
                                    key=move |option| { option.value.clone() }
                                    let:option
                                >
                                    <div
                                        class="tw-px-4 tw-py-2 tw-cursor-pointer hover:tw-bg-primary last:tw-rounded-b-2xl hover:tw-text-text-onprimary tw-border-b last:tw-border-b-0"
                                        on:click=move |_| {
                                            handle_select.with_value(|f| f(option.value.clone()))
                                        }
                                    >

                                        {option.label.clone().to_string()}
                                    </div>
                                </For>
                            }
                                .into_view()
                        }
                    }}

                </Show>
            </div>

            {move || {
                if let Some(ref err) = error_message.get() {
                    view! { <div class="tw-ml-4 tw-text-red-500 tw-text-sm">{err}</div> }
                        .into_view()
                } else {
                    view! {}.into_view()
                }
            }}

        </div>
    }
}

#[component]
pub fn Placeholder(text: String) -> impl IntoView {
    view! { <div class="tw-text-transparent">{text}</div> }
}
