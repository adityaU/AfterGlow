pub mod components;

use leptos::*;
use leptos_router::*;

use crate::components::header::Header;
use crate::components::home::Home;

fn main() {
    mount_to_body(|| view! { <App /> })
}
#[component]
fn App() -> impl IntoView {
    view! {
      <Router>
        <nav>
          <Header />
          /* ... */
        </nav>
        <main>
          // all our routes will appear inside <main>
          <Routes>
          <Route path="/" view=Home/>
            /* ... */
          </Routes>
        </main>
      </Router>
    }
}
