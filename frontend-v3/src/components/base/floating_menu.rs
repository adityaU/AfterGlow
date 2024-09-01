use leptos::{
    component, create_effect, create_node_ref, html::Div, store_value, view, Children, IntoView,
    ReadSignal, Show, SignalGet, SignalWith, WriteSignal,
};

use crate::helpers::click_outside::hide_on_click_outside;

#[component]
pub fn FloatingMenu(
    show: ReadSignal<bool>,
    set_show: WriteSignal<bool>,
    children: Children,
) -> impl IntoView {
    let content_view = children();

    let element_ref = create_node_ref::<Div>();

    create_effect(move |_| hide_on_click_outside(&element_ref, set_show));

    view! {
        <Show when=move || show.get()>
            <div
                class="tw-absolute tw-border tw-rounded-2xl tw-shadow-sm tw-py-2 tw-bg-white"
                ref=element_ref
            >
                {content_view.clone()}
            </div>
        </Show>
    }
}
