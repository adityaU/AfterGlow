use leptos::{
    component, create_action, create_memo, create_signal, view, IntoView, SignalGet, SignalSet,
};
use web_sys::SubmitEvent;

use crate::{
    apis::apps,
    components::base::{button::Button, input::Input},
    helpers::redirect::relative_redirect_to,
};

#[component]
pub fn AppsCreate() -> impl IntoView {
    let (name, set_name) = create_signal(String::from(""));
    let (description, set_description) = create_signal(String::from(""));
    let (error_message, set_error_message) = create_signal(None::<String>);
    let (description_error_message, set_description_error_message) = create_signal(None::<String>);
    let create_app_action = create_action(move |&(ref input, ref desc): &(String, String)| {
        let input = input.clone();
        let description = desc.clone();
        let set_error_message = set_error_message.clone();
        async move {
            match apps::create(input, description).await {
                Ok(_app) => relative_redirect_to("/apps/home"),
                Err(e) => {
                    set_error_message.set(Some(e.to_string()));
                }
            }
        }
    });
    let handle_submit = move |ev: SubmitEvent| {
        ev.prevent_default(); // Prevent the default form submission behavior
        if name.get().is_empty() {
            set_error_message.set(Some("Name cannot be empty".to_string()));
        } else {
            set_error_message.set(None);
            // Handle form submission here
        }
        if error_message.get().is_none() {
            create_app_action.dispatch((name.get(), description.get()));
        }
    };

    let name_memo = create_memo(move |_| Some(name.get().clone()));
    let set_name_updater_func = move |s: Option<String>| {
        set_name.set(s.unwrap_or_default());
        set_error_message.set(None);
    };
    let desc_memo = create_memo(move |_| Some(description.get().clone()));
    let set_desc_updater_func = move |s: Option<String>| {
        set_description.set(s.unwrap_or_default());
    };

    view! {
        <div class="tw-flex tw-justify-center tw-items-center tw-h-full">
            <div class="tw-w-1/3 tw-bg-white tw-p-4 tw-rounded-2xl tw-border">
                <h1 class="tw-mb-4">"Create a new app"</h1>
                <form on:submit=handle_submit>
                    <Input
                        value=name_memo
                        set_value=Box::new(set_name_updater_func)
                        label="Name".to_string()
                        input_type="text".to_string()
                        error_message=error_message
                        classes="tw-mb-4".to_string()
                    />
                    <Input
                        value=desc_memo
                        set_value=Box::new(set_desc_updater_func)
                        label="Description".to_string()
                        input_type="text".to_string()
                        error_message=description_error_message
                        classes="tw-mb-4".to_string()
                    />

                    <div class="tw-flex tw-justify-end">
                        // This is a custom button component
                        <Button label="Create".to_string()/>

                    </div>
                </form>
            </div>
        </div>
    }
}
