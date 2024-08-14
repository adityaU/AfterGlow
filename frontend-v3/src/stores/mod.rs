pub mod session;


use leptos::Effect;


use self::session::SessionStore;

#[derive(Default, Debug, Clone)]
pub struct Store {
    pub session: Effect<SessionStore>,
}

impl Store {
    // pub fn new() -> Self {
    //     let mut store = Self::default();
    //     store.session = SessionStore::new();
    //     console::log_1(&JsValue::from_str(
    //         &format!("Store: {:?}", store.session).as_str(),
    //     ));
    //     store
    // }
    // pub fn provide_context() {
    //     let store = Store::new();
    //     provide_context(store);
    // }
    // pub fn use_context() -> Option<RwSignal<Self>> {
    //     use_context::<RwSignal<Self>>()
    // }
}
