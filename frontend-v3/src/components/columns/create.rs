use common::models::{
    app_column::{
        AbbrievationFormat, AppColumnView, CheckboxStyle, DateFormat, DateTimeFormat,
        NumberFormats, PercentDisplayOptions, TypeValidation,
    },
    app_table::AppTableView,
};
use leptos::{
    component, create_action, create_memo, create_signal, view, IntoView, ReadSignal, SignalGet,
    SignalSet, SignalUpdate, WriteSignal,
};

use crate::{
    apis::apps::create_column,
    components::{
        base::{
            button::Button,
            input::Input,
            select::{OptionItem, Select},
        },
        columns::type_validation_forms::{
            attachment::TypeValidationFormAttachment, auto_number::TypeValidationFormAutoNumber,
            checkbox::TypeValidationFormCheckbox, created_at::TypeValidationFormCreatedAt,
            created_by::TypeValidationFormCreatedBy, currency::TypeValidationFormCurrency,
            date::TypeValidationFormDate, datetime::TypeValidationFormDateTime,
            email::TypeValidationFormEmail, formula::TypeValidationFormFormula,
            multiple_select::TypeValidationFormMultipleSelect, number::TypeValidationFormNumber,
            percentage::TypeValidationFormPercentage, phone_number::TypeValidationFormPhoneNumber,
            progress_bar::TypeValidationFormProgressBar, rating::TypeValidationFormRating,
            single_select::TypeValidationFormSingleSelect, text::TypeValidationFormText,
            updated_at::TypeValidationFormUpdatedAt, updated_by::TypeValidationFormLastModifiedBy,
            url::TypeValidationFormUrl, user::TypeValidationFormUser,
        },
        helpers::modal::Modal,
    },
};

#[component]
pub fn CreateColumn(
    open: ReadSignal<bool>,
    set_open: WriteSignal<bool>,
    table: ReadSignal<Option<AppTableView>>,
    columns: WriteSignal<Vec<AppColumnView>>,
) -> impl IntoView {
    let (name, set_name) = create_signal(String::new());
    let (data_type, set_data_type) = create_signal(None::<TypeValidation>);
    let (name_error, set_name_error) = create_signal(None::<String>);
    let handle_submit = move |_| {};
    let select_options = vec![
        OptionItem {
            value: TypeValidation::Number {
                is_integer: true,
                precision: None,
                format: NumberFormats::US,
                default: None,
                allow_negetive: false,
            },
            label: "Number",
        },
        OptionItem {
            value: TypeValidation::Text {
                max_length: None,
                min_length: None,
                enable_rich_formatting: false,
                default: None,
            },
            label: "Text",
        },
        OptionItem {
            value: TypeValidation::Date {
                default_to_current: false,
                format: DateFormat::US,
            },
            label: "Date",
        },
        OptionItem {
            value: TypeValidation::DateTime {
                default_to_current: false,
                format: DateTimeFormat::US,
            },
            label: "DateTime",
        },
        OptionItem {
            value: TypeValidation::Email { default: None },
            label: "Email",
        },
        OptionItem {
            value: TypeValidation::Url { default: None },
            label: "Url",
        },
        OptionItem {
            value: TypeValidation::Attachment {
                default: None,
                max_size: Some(5),
                possible_extensions: vec![],
            },
            label: "Attachment",
        },
        OptionItem {
            value: TypeValidation::MultipleSelect {
                options: vec![],
                default: None,
            },
            label: "MultipleSelect",
        },
        OptionItem {
            value: TypeValidation::SingleSelect {
                default: None,
                options: vec![],
            },
            label: "SingleSelect",
        },
        OptionItem {
            value: TypeValidation::PhoneNumber { default: None },
            label: "PhoneNumber",
        },
        OptionItem {
            value: TypeValidation::Currency {
                symbol: None,
                default: None,
                format: NumberFormats::US,
                allow_negetive: false,
                decimal_places: 0,
                abbreviation: AbbrievationFormat::None,
            },
            label: "Currency",
        },
        OptionItem {
            value: TypeValidation::Percentage {
                default: None,
                decimal_places: 0,
                format: NumberFormats::US,
                allow_negetive: false,
                display_as: PercentDisplayOptions::Bar,
            },
            label: "Percentage",
        },
        OptionItem {
            value: TypeValidation::CreatedBy {},
            label: "CreatedBy",
        },
        OptionItem {
            value: TypeValidation::LastModifiedBy {},
            label: "LastModifiedBy",
        },
        OptionItem {
            value: TypeValidation::AutoNumber {},
            label: "AutoNumber",
        },
        OptionItem {
            value: TypeValidation::Formula {
                formula: "1".to_string(),
                format: Box::new(TypeValidation::Number {
                    is_integer: true,
                    precision: None,
                    format: NumberFormats::US,
                    default: None,
                    allow_negetive: false,
                }),
            },
            label: "Formula",
        },
        OptionItem {
            value: TypeValidation::Checkbox {
                style: CheckboxStyle::Tick,
                default: false,
            },
            label: "Checkbox",
        },
        OptionItem {
            value: TypeValidation::User {
                allow_multiple: false,
                default: None,
            },
            label: "User",
        },
        OptionItem {
            value: TypeValidation::CreatedAt {
                format: DateTimeFormat::US,
            },
            label: "CreatedAt",
        },
        OptionItem {
            value: TypeValidation::UpdatedAt {
                format: DateTimeFormat::US,
            },
            label: "UpdatedAt",
        },
        OptionItem {
            value: TypeValidation::Rating {
                max: 5,
                default: Some(0),
                allowed_decimal: false,
                decimal_places: 2,
            },
            label: "Rating",
        },
        OptionItem {
            value: TypeValidation::ProgressBar {
                max: 100,
                default: Some(0),
                allowed_decimal: false,
                decimal_places: 2,
            },
            label: "ProgressBar",
        },
    ];

    let name_memo = create_memo(move |_| Some(name.get().clone()));
    let set_name_updater_func = move |s: Option<String>| {
        set_name.set(s.clone().unwrap_or_default());
        if s.unwrap_or_default().is_empty() {
            set_name_error.set(Some("Name cannot be empty".to_string()));
        } else {
            set_name_error.set(None);
        }
    };

    let data_type_memo = create_memo(move |_| data_type.get().clone());
    let data_type_updater_func = move |s: Option<TypeValidation>| {
        set_data_type.set(s);
    };

    let (description, set_description) = create_signal(String::new());
    let (description_error_message, set_description_error_message) = create_signal(None::<String>);
    let description_memo = create_memo(move |_| Some(description.get().clone()));
    let set_desc_updater_func = move |s: Option<String>| {
        set_description.set(s.unwrap_or_default());
    };

    let type_validation_display_func = move || match data_type.get() {
        Some(TypeValidation::Number { .. }) => "Number".to_string(),
        Some(TypeValidation::Text { .. }) => "Text".to_string(),
        Some(TypeValidation::Date { .. }) => "Date".to_string(),
        Some(TypeValidation::DateTime { .. }) => "DateTime".to_string(),
        Some(TypeValidation::Email { .. }) => "Email".to_string(),
        Some(TypeValidation::Url { .. }) => "Url".to_string(),
        Some(TypeValidation::Attachment { .. }) => "Attachment".to_string(),
        Some(TypeValidation::MultipleSelect { .. }) => "MultipleSelect".to_string(),
        Some(TypeValidation::SingleSelect { .. }) => "SingleSelect".to_string(),
        Some(TypeValidation::PhoneNumber { .. }) => "PhoneNumber".to_string(),
        Some(TypeValidation::Currency { .. }) => "Currency".to_string(),
        Some(TypeValidation::Percentage { .. }) => "Percentage".to_string(),
        Some(TypeValidation::CreatedBy {}) => "CreatedBy".to_string(),
        Some(TypeValidation::LastModifiedBy {}) => "LastModifiedBy".to_string(),
        Some(TypeValidation::AutoNumber {}) => "AutoNumber".to_string(),
        Some(TypeValidation::Formula { .. }) => "Formula".to_string(),
        Some(TypeValidation::Checkbox { .. }) => "Checkbox".to_string(),
        Some(TypeValidation::User { .. }) => "User".to_string(),
        Some(TypeValidation::CreatedAt { .. }) => "CreatedAt".to_string(),
        Some(TypeValidation::UpdatedAt { .. }) => "UpdatedAt".to_string(),
        Some(TypeValidation::Rating { .. }) => "Rating".to_string(),
        Some(TypeValidation::ProgressBar { .. }) => "ProgressBar".to_string(),
        None => "Select Column Type".to_string(),
    };

    let (error, set_error) = create_signal(false);

    let disabled_add_btn =
        move || error.get() || name.get().is_empty() || data_type.get().is_none();

    let (backend_error, set_backend_error) = create_signal(None::<String>);

    let create_column_action = create_action(move |_| {
        let table = table.get().unwrap_or_default();
        async move {
            let column = create_column(
                name.get(),
                description.get(),
                table.id,
                data_type.get().unwrap_or_default(),
                3,
            )
            .await;
            match column {
                Ok(column) => {
                    columns.update(|c| c.push(column));
                    set_open.set(false);
                }
                Err(err) => set_backend_error.set(Some(err.to_string())),
            }
        }
    });

    let add_column = move |_| {
        if !disabled_add_btn() {
            create_column_action.dispatch("pass");
        }
    };

    view! {
        <Modal
            open=open
            set_open=set_open
            header=Some(|| view! { "Add a column" }.into_view())

            body=move || {
                view! {
                    <form on:submit=handle_submit>
                        <Input
                            label="Name".to_string()
                            value=name_memo
                            set_value=Box::new(set_name_updater_func)
                            input_type="text".to_string()
                            error_message=name_error
                            classes="tw-mb-4".to_string()
                        />

                        <Input
                            label="Description".to_string()
                            value=description_memo
                            set_value=Box::new(set_desc_updater_func)
                            input_type="text".to_string()
                            error_message=description_error_message
                            classes="tw-mb-4".to_string()
                        />
                        <Select
                            options=select_options.clone()
                            value=data_type_memo
                            set_value=Box::new(data_type_updater_func)
                            label="Select Column Type".to_string()
                            display_func=Box::new(type_validation_display_func)
                            error_message=name_error
                            classes="".to_string()
                        />
                        <TypeValidationForm tv=data_type set_tv=set_data_type set_error=set_error/>

                        {move || {
                            if backend_error.get().is_some() {
                                view! {
                                    <div class="tw-text-red-500 tw-text-sm tw-mt-4">
                                        {backend_error.get().as_ref().unwrap()}
                                    </div>
                                }
                                    .into_view()
                            } else {
                                view! {}.into_view()
                            }
                        }}

                    </form>
                }
                    .into_view()
            }

            footer=Some(move || {
                view! {
                    <div class="tw-flex tw-justify-end tw-items-center tw-gap-2 tw-p-4">

                        <button
                            type="button"
                            class="tw-text-default tw-bg-secondary tw-rounded-full tw-py-2 tw-px-4 tw-border"
                            on:click=move |_| set_open.set(false)
                        >
                            "Cancel"
                        </button>
                        <button
                            type="submit"
                            class="tw-bg-primary tw-text-text-onprimary tw-rounded-full tw-py-2 tw-px-4"
                            disabled=disabled_add_btn
                            on:click=add_column
                        >

                            "Add"
                        </button>
                    </div>
                }
                    .into_view()
            })
        />
    }
}

#[component]
pub fn TypeValidationForm(
    tv: ReadSignal<Option<TypeValidation>>,
    set_tv: WriteSignal<Option<TypeValidation>>,
    set_error: WriteSignal<bool>,
) -> impl IntoView {
    let tv_type = create_memo(move |_| tv.get().as_ref().map(|tvtype| tvtype.get_type()));
    view! {
        <div class=move || {
            match tv_type.get().unwrap_or_default().as_str() {
                "" => "tw-hidden",
                _ => "tw-mt-4",
            }
        }>
            {move || {
                match tv_type.get().unwrap_or_default().as_str() {
                    "number" => {
                        view! {
                            <TypeValidationFormNumber tv=tv set_tv=set_tv set_error=set_error/>
                        }
                    }
                    "text" => {
                        view! { <TypeValidationFormText tv=tv set_tv=set_tv set_error=set_error/> }
                    }
                    "date" => {
                        view! { <TypeValidationFormDate tv=tv set_tv=set_tv set_error=set_error/> }
                    }
                    "datetime" => {
                        view! {
                            <TypeValidationFormDateTime tv=tv set_tv=set_tv set_error=set_error/>
                        }
                    }
                    "email" => {
                        view! { <TypeValidationFormEmail tv=tv set_tv=set_tv set_error=set_error/> }
                    }
                    "url" => {
                        view! { <TypeValidationFormUrl tv=tv set_tv=set_tv set_error=set_error/> }
                    }
                    "attachment" => {
                        view! {
                            <TypeValidationFormAttachment tv=tv set_tv=set_tv set_error=set_error/>
                        }
                    }
                    "multiple_select" => {
                        view! {
                            <TypeValidationFormMultipleSelect
                                tv=tv
                                set_tv=set_tv
                                set_error=set_error
                            />
                        }
                    }
                    "single_select" => {
                        view! {
                            <TypeValidationFormSingleSelect
                                tv=tv
                                set_tv=set_tv
                                set_error=set_error
                            />
                        }
                    }
                    "phone_number" => {
                        view! {
                            <TypeValidationFormPhoneNumber tv=tv set_tv=set_tv set_error=set_error/>
                        }
                    }
                    "currency" => {
                        view! {
                            <TypeValidationFormCurrency tv=tv set_tv=set_tv set_error=set_error/>
                        }
                    }
                    "percentage" => {
                        view! {
                            <TypeValidationFormPercentage tv=tv set_tv=set_tv set_error=set_error/>
                        }
                    }
                    "created_by" => {
                        view! {
                            <TypeValidationFormCreatedBy tv=tv set_tv=set_tv set_error=set_error/>
                        }
                    }
                    "last_modified_by" => {
                        view! {
                            <TypeValidationFormLastModifiedBy
                                tv=tv
                                set_tv=set_tv
                                set_error=set_error
                            />
                        }
                    }
                    "auto_number" => {
                        view! {
                            <TypeValidationFormAutoNumber tv=tv set_tv=set_tv set_error=set_error/>
                        }
                    }
                    "formula" => {
                        view! {
                            <TypeValidationFormFormula tv=tv set_tv=set_tv set_error=set_error/>
                        }
                    }
                    "checkbox" => {
                        view! {
                            <TypeValidationFormCheckbox tv=tv set_tv=set_tv set_error=set_error/>
                        }
                    }
                    "user" => {
                        view! { <TypeValidationFormUser tv=tv set_tv=set_tv set_error=set_error/> }
                    }
                    "created_at" => {
                        view! {
                            <TypeValidationFormCreatedAt tv=tv set_tv=set_tv set_error=set_error/>
                        }
                    }
                    "updated_at" => {
                        view! {
                            <TypeValidationFormUpdatedAt tv=tv set_tv=set_tv set_error=set_error/>
                        }
                    }
                    "rating" => {
                        view! {
                            <TypeValidationFormRating tv=tv set_tv=set_tv set_error=set_error/>
                        }
                    }
                    "progress_bar" => {
                        view! {
                            <TypeValidationFormProgressBar tv=tv set_tv=set_tv set_error=set_error/>
                        }
                    }
                    _ => view! {}.into_view(),
                }
            }}

        </div>
    }
}
