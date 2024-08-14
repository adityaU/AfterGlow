use leptos::*;

#[component]
pub fn header(children: Children) -> impl IntoView {
    view! { <div class="tw-flex tw-bg-white tw-px-4 tw-py-2 tw-border-y tw-w-full">{children()}</div> }
}
