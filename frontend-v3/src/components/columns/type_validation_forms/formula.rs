use common::models::app_column::TypeValidation;
use leptos::{component, view, IntoView, ReadSignal, WriteSignal};

#[component]
pub fn TypeValidationFormFormula(
    tv: ReadSignal<Option<TypeValidation>>,
    set_tv: WriteSignal<Option<TypeValidation>>,
    set_error: WriteSignal<bool>,
) -> impl IntoView {
    view! { WIP. Stay tuned! }
}
