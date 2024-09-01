use leptos::{
    html::Div, leptos_dom::logging::console_log, NodeRef, SignalGet, SignalSet, WriteSignal,
};
use web_sys::{
    console,
    wasm_bindgen::{closure::Closure, JsCast},
    Node,
};

pub fn hide_on_click_outside(
    element_ref: &NodeRef<Div>,
    set_is_open: WriteSignal<bool>,
) -> Box<dyn FnOnce()> {
    if let Some(element) = element_ref.get() {
        // Create the closure to handle the click event
        let handle_click_outside = Closure::wrap(Box::new(move |event: web_sys::MouseEvent| {
            if let Some(target) = event.target() {
                if let Ok(target_node) = target.dyn_into::<Node>() {
                    if !element.contains(Some(&target_node)) {
                        set_is_open.set(false);
                    }
                }
            }
        }) as Box<dyn FnMut(_)>);

        if let Some(window) = web_sys::window() {
            // Add the event listener for "click"
            let _ = window.add_event_listener_with_callback(
                "click",
                handle_click_outside.as_ref().unchecked_ref(),
            );
        }

        // Return a cleanup function to remove the event listener
        return Box::new(move || {
            console::log_1(&"i was here 67611".into());

            if let Some(window) = web_sys::window() {
                // Remove the event listener
                let _ = window.remove_event_listener_with_callback(
                    "click",
                    handle_click_outside.as_ref().unchecked_ref(),
                );
            }

            // Forget the closure to avoid memory leaks
            handle_click_outside.forget();
        });
    }

    // Return an empty cleanup function if element is not found
    Box::new(move || {})
}
