pub mod apis;
pub mod components;
pub mod helpers;
pub mod stores;

use leptos::*;
use leptos_router::*;

use crate::{
    components::{
        apps::{all::AppsAll, create::AppsCreate, show::AppsShow},
        footer::Footer,
        sidebar::Sidebar,
    },
    stores::session::SessionStore,
};

fn main() {
    mount_to_body(|| view! { <App/> })
}
#[component]
fn App() -> impl IntoView {
    // our resource
    let session = create_resource(
        || (),
        // every time `count` changes, this will run
        |_value| async move { SessionStore::initialize().await },
    );
    provide_context(session);
    view! {
        <Router>
            <div class="tw-flex">
                <nav>
                    <Sidebar/>

                </nav>
                <main class="tw-w-full">
                    // all our routes will appear inside <main>
                    <Routes>
                        <Route path="/apps/home" view=AppsAll/>
                        <Route path="/apps/create" view=AppsCreate/>
                        <Route path="/apps/:id" view=AppsShow/>

                        <Route path="/*any" view=|| view! { <h1>"Not Found"</h1> }/>

                    </Routes>
                </main>
            </div>
            <Footer/>
        </Router>
    }
}
