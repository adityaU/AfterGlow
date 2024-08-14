use icondata as i;
use leptos::{component, view, IntoView, ReadSignal, SignalGet};
use leptos_icons::Icon;

#[component]
pub fn Chevron(toggle_read: ReadSignal<bool>, size: String) -> impl IntoView {
    view! {
        {move || {
            if toggle_read.get() {
                view! {
                    <Icon
                        height=size.clone()
                        width=size.clone()
                        icon=i::TbChevronRight
                        class="tw-text-lg"
                    />
                }
            } else {
                view! {
                    <Icon
                        height=size.clone()
                        width=size.clone()
                        icon=i::TbChevronDown
                        class="tw-text-lg"
                    />
                }
            }
        }}
    }
}
