use leptos::{component, view, IntoView, ReadSignal, SignalGet, SignalSet, View, WriteSignal};

#[component]
pub fn Modal<H, B, F>(
    open: ReadSignal<bool>,
    set_open: WriteSignal<bool>,
    header: Option<H>,
    body: B,
    footer: Option<F>,
) -> impl IntoView
where
    H: Fn() -> View + 'static,
    B: Fn() -> View + 'static,
    F: Fn() -> View + 'static,
{
    view! {
        <div
            class=move || {
                let base_classes = "tw-absolute tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-justify-center tw-items-center tw-transition-opacity tw-duration-300";
                if open.get() {
                    format!("{} tw-opacity-100", base_classes)
                } else {
                    format!("{} tw-opacity-0 tw-pointer-events-none", base_classes)
                }
            }

            on:click=move |_| {
                set_open.set(false);
            }
        >

            <div
                class=move || {
                    let modal_classes = "tw-w-1/3 tw-bg-white tw-rounded-2xl tw-border tw-transform tw-transition-all tw-duration-300";
                    if open.get() {
                        format!("{} tw-translate-y-0 tw-opacity-100", modal_classes)
                    } else {
                        format!("{} -tw-translate-y-full tw-opacity-0", modal_classes)
                    }
                }

                on:click=move |ev| {
                    ev.stop_propagation();
                    ev.prevent_default()
                }
            >

                {header
                    .map(|header| {
                        view! {
                            <div class="tw-px-4 tw-py-4 tw-text-2xl tw-border-b tw-font-semibold">
                                {header()}
                            </div>
                        }
                    })}

                <div class="tw-px-4 tw-py-4 tw-border-b">{body()}</div>

                {footer.map(|footer| view! { <div class="modal-footer">{footer()}</div> })}
            </div>
        </div>
    }
}
