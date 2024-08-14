use common::models::app_column::TypeValidation;
use leptos::{component, view, IntoView, ReadSignal, SignalGet, WriteSignal};
use web_sys::{console, wasm_bindgen::JsValue};

#[component]
pub fn TypeValidationFormUpdatedAt(
    tv: ReadSignal<Option<TypeValidation>>,
    set_tv: WriteSignal<Option<TypeValidation>>,
    set_error: WriteSignal<bool>,
) -> impl IntoView {
    view! { <div class="note">System-Generated. indicating when record was last updated.</div> }
}
