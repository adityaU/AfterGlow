use leptos::{create_signal, ReadSignal, SignalGet, SignalUpdate, WriteSignal};
use web_sys::window;

use crate::apis::{
    self,
    session::{verify_token, Session},
};

const ACCESS_TOKEN_KEY: &str = "ag_access_token";

#[derive(Debug, Clone)]
pub struct SessionStore {
    reader: ReadSignal<Option<Session>>,
    writer: WriteSignal<Option<Session>>,
    local_storage: web_sys::Storage,
}

impl Default for SessionStore {
    fn default() -> Self {
        let (reader, writer) = create_signal::<Option<Session>>(None);
        let local_storage = Self::local_storage();
        Self {
            reader,
            writer,
            local_storage,
        }
    }
}

impl SessionStore {
    pub fn update(&self, session: Session) {
        self.writer.update(|wr| *wr = Some(session));
    }
    pub fn get(&self) -> Option<Session> {
        self.reader.get()
    }

    pub async fn initialize(&self) {
        let token = self
            .local_storage
            .get_item(ACCESS_TOKEN_KEY)
            .unwrap_or_default()
            .unwrap_or_default();

        if let Ok(session) = verify_token(token).await {
            self.update(session)
        }
    }

    fn local_storage() -> web_sys::Storage {
        let window = window().expect("no global `window` exists");
        window
            .local_storage()
            .expect("should have `localStorage`")
            .expect("no `localStorage` found")
    }
}
