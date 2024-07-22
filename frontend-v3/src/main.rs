pub mod apis;
pub mod components;
pub mod stores;

use leptos::*;
use leptos_router::*;
use stores::Store;

use crate::components::header::Sidebar;
use crate::components::home::Home;

fn main() {
    mount_to_body(|| view! { <App/> })
}
#[component]
fn App() -> impl IntoView {
    Store::provide_context();

    view! {
        <Router>
            <nav>
                <Sidebar/>

            </nav>
            <main>
                // all our routes will appear inside <main>
                <Routes>
                    <Route path="/apps" view=Home/>

                </Routes>
            </main>
        </Router>

    }
}
