use leptos::{component, view, IntoView, Memo, SignalGet};

#[component]
pub fn Toggle(
    value: Memo<bool>,
    set_value: Box<dyn Fn(bool)>,
    label: String,
    classes: String,
) -> impl IntoView {
    let toggle = move |_| set_value(!value.get());

    view! {
        <div class=classes>
            <div class="tw-inline-flex tw-items-center tw-cursor-pointer ">
                <div
                    class=move || {
                        format!(
                            "tw-relative tw-w-12 tw-h-6 tw-border tw-rounded-full tw-transition-colors tw-duration-300 {}",
                            if value.get() { "tw-bg-primary" } else { "tw-bg-secondary" },
                        )
                    }

                    on:click=toggle
                >
                    <div class=move || {
                        format!(
                            "tw-absolute tw-top-0.5 tw-left-0.5 tw-w-5 tw-h-5 tw-bg-white tw-rounded-full tw-transition-transform tw-duration-300 {}",
                            if value.get() { "tw-transform tw-translate-x-6" } else { "" },
                        )
                    }>

                        {}
                    </div>
                </div>

                <span class="tw-ml-2">{label}</span>
            </div>
        </div>
    }
}
