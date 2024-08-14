use super::header::Header;
use leptos::*;

#[component]
pub fn AppHome() -> impl IntoView {
    view! {
        <Header>
            <h1>Create a database</h1>
        </Header>
    }
}
