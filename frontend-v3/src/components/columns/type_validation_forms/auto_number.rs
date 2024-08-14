use common::models::app_column::TypeValidation;
use leptos::{component, view, IntoView, ReadSignal, SignalGet, WriteSignal};
use web_sys::{console, wasm_bindgen::JsValue};

#[component]
pub fn TypeValidationFormAutoNumber(
    tv: ReadSignal<Option<TypeValidation>>,
    set_tv: WriteSignal<Option<TypeValidation>>,
    set_error: WriteSignal<bool>,
) -> impl IntoView {
    view! {
        <div class="note">
            System-generated, sequentially creates an identifier number, typically used for the ID field.
        </div>
    }
}
