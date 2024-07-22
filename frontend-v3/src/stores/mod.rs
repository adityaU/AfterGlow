pub mod session;

use leptos::{provide_context, spawn_local, use_context};

use crate::apis::session::Session;

use self::session::SessionStore;

#[derive(Default, Debug, Clone)]
pub struct Store {
    pub session: SessionStore,
}

impl Store {
    pub fn set_session(&mut self, session: Session) {
        self.session.update(session);
    }
    pub fn get_session(&self) -> Option<Session> {
        self.session.get()
    }
    pub fn provide_context() {
        let store = Self::default();
        provide_context(store.clone());
        spawn_local(async move {
            store.session.initialize().await;
        })
    }
    pub fn use_context() -> Self {
        use_context::<Self>().expect("Global Store not found")
    }
}
