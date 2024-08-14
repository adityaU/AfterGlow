use leptos::{component, view, IntoView};

#[component]
pub fn button(label: String) -> impl IntoView {
    view! {
        <button
            type="submit"
            class="tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-bg-primary tw-border tw-border-transparent tw-rounded-full tw-font-semibold tw-text-white tw-shadow-sm hover:tw-bg-primary/80 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-indigo-500"
        >
            {label}
        </button>
    }
}
