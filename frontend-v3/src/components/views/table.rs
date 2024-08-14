use std::rc::Rc;

use common::models::{
    app_column::{AppColumnView, TypeValidation},
    app_table::AppTableView,
    row::RowElement,
};
use icondata as i;
use leptos::{
    component, create_signal, view, For, IntoView, ReadSignal, SignalGet, SignalSet, WriteSignal,
};
use leptos_icons::Icon;
use web_sys::{console, wasm_bindgen::JsCast, DragEvent, HtmlElement, MouseEvent};

use crate::components::{self, columns::create::CreateColumn};

#[component]
pub fn TableHeaders(
    columns: ReadSignal<Vec<AppColumnView>>,
    set_columns: WriteSignal<Vec<AppColumnView>>,
    table: ReadSignal<Option<AppTableView>>,
    on_mousedown: Rc<dyn Fn(MouseEvent, usize)>,
    on_dragstart: Rc<dyn Fn(DragEvent, usize)>,
    on_drop: Rc<dyn Fn(DragEvent, usize)>,
) -> impl IntoView {
    let (open, set_open) = create_signal(false);

    view! {
        <thead class="tw-px-4">
            <For
                each=move || { columns.get().iter().cloned().enumerate().collect::<Vec<_>>() }
                key=|(index, column)| column.id
                children=move |(index, column)| {
                    let on_mousedown = on_mousedown.clone();
                    let on_dragstart = on_dragstart.clone();
                    let on_drop = on_drop.clone();
                    view! {
                        <th
                            on:mousedown=move |e| on_mousedown(e, index)
                            on:dragstart=move |e| on_dragstart(e, index)
                            on:dragover=|e| e.prevent_default()
                            on:drop=move |e| on_drop(e, index)
                            draggable="true"
                            class="tw-px-4 tw-py-2 tw-border even:tw-bg-primary/20 tw-cursor-move"
                        >
                            {&column.name}
                        </th>
                    }
                }
            />

            <th class="tw-px-4 tw-py-2" on:click=move |_| { set_open.set(!open.get()) }>

                <Icon icon=i::TbPlus/>
            </th>
        </thead>

        <CreateColumn open=open set_open=set_open table=table columns=set_columns/>
    }
}

#[component]
pub fn TableRows(
    columns: ReadSignal<Vec<AppColumnView>>,
    table: ReadSignal<Option<AppTableView>>,
    rows: ReadSignal<Vec<RowElement>>,
) -> impl IntoView {
    view! {
        <tbody>
            <tr>
                <For each=move || columns.get().clone() key=move |column| column.id let:column>
                    <td class="tw-border tw-px-4 tw-py-2 even:tw-bg-primary/20 ">
                        {match column.type_validation.get_type().as_str() {
                            "text" => view! { <InputCellText tv=column.type_validation.clone()/> },
                            "date" => view! { <InputCellDate tv=column.type_validation.clone()/> },
                            "datetime" => {
                                view! { <InputCellDateTime tv=column.type_validation.clone()/> }
                            }
                            "email" => view! { <InputCellEmail tv=column.type_validation.clone()/> },
                            "url" => view! { <InputCellUrl tv=column.type_validation.clone()/> },
                            "attachment" => {
                                view! { <InputCellAttachment tv=column.type_validation.clone()/> }
                            }
                            "multiple_select" => {
                                view! {
                                    <InputCellMultipleSelect tv=column.type_validation.clone()/>
                                }
                            }
                            "single_select" => {
                                view! { <InputCellSingleSelect tv=column.type_validation.clone()/> }
                            }
                            "phone_number" => {
                                view! { <InputCellPhoneNumber tv=column.type_validation.clone()/> }
                            }
                            "currency" => {
                                view! { <InputCellCurrency tv=column.type_validation.clone()/> }
                            }
                            "percentage" => {
                                view! { <InputCellPercentage tv=column.type_validation.clone()/> }
                            }
                            "created_by" => {
                                view! { <InputCellCreatedBy tv=column.type_validation.clone()/> }
                            }
                            "last_modified_by" => {
                                view! {
                                    <InputCellLastModifiedBy tv=column.type_validation.clone()/>
                                }
                            }
                            "auto_number" => {
                                view! { <InputCellAutoNumber tv=column.type_validation.clone()/> }
                            }
                            "formula" => {
                                view! { <InputCellFormula tv=column.type_validation.clone()/> }
                            }
                            "checkbox" => {
                                view! { <InputCellCheckbox tv=column.type_validation.clone()/> }
                            }
                            "user" => view! { <InputCellUser tv=column.type_validation.clone()/> },
                            "created_at" => {
                                view! { <InputCellCreatedAt tv=column.type_validation.clone()/> }
                            }
                            "updated_at" => {
                                view! { <InputCellUpdatedAt tv=column.type_validation.clone()/> }
                            }
                            "rating" => {
                                view! { <InputCellRating tv=column.type_validation.clone()/> }
                            }
                            "progress_bar" => {
                                view! { <InputCellProgressBar tv=column.type_validation.clone()/> }
                            }
                            _ => view! { <InputCellText tv=column.type_validation.clone()/> },
                        }}

                    </td>
                </For>
            </tr>
        </tbody>
    }
}
#[component]
pub fn Table(
    columns: ReadSignal<Vec<AppColumnView>>,
    set_columns: WriteSignal<Vec<AppColumnView>>,
    table: ReadSignal<Option<AppTableView>>,
) -> impl IntoView {
    let (rows, set_rows) = create_signal(Vec::new());

    let (start_x, set_start_x) = create_signal(0.0);
    let (start_width, set_start_width) = create_signal(0.0);
    let (dragging, set_dragging) = create_signal(false);
    let (drag_col_index, set_drag_col_index) = create_signal(0);

    let on_mousedown = move |e: MouseEvent, col_index: usize| {
        let target = e.target().unwrap().dyn_into::<HtmlElement>().unwrap();
        set_start_x.set(e.client_x() as f64);
        set_start_width.set(target.offset_width() as f64);
        set_drag_col_index.set(col_index);
        set_dragging.set(true);
    };

    let on_mousemove = move |e: MouseEvent| {
        if dragging.get() {
            let target = e.target().unwrap().dyn_into::<HtmlElement>().unwrap();
            let new_width = start_width.get() + (e.client_x() as f64 - start_x.get());
            target
                .style()
                .set_property("width", &format!("{}px", new_width))
                .unwrap();
        };
    };

    let on_mouseup = move |_: MouseEvent| {
        set_dragging.set(false);
    };

    let on_dragstart = move |e: DragEvent, col_index: usize| {
        set_drag_col_index.set(col_index);
        e.data_transfer().unwrap().set_effect_allowed("move");
    };

    let on_drop = move |e: DragEvent, target_col_index: usize| {
        e.prevent_default();
        if drag_col_index.get() != target_col_index {
            let mut new_columns = columns.get().clone();
            let dragged_column = new_columns.remove(drag_col_index.get());
            new_columns.insert(target_col_index, dragged_column);

            // Update display_order based on the new order
            for (i, col) in new_columns.iter_mut().enumerate() {
                col.display_order = i as i32;
            }

            // Update the signal with the new column order
            set_columns.set(new_columns);
        }
    };
    view! {
        <div class="tw-px-4 tw-py-2">
            <table
                class="tw-w-full tw-text-sm tw-text-left tw-px-4"
                // on:mousemove=on_mousemove
                // on:mouseup=on_mouseup
            >
                <TableHeaders
                    columns=columns
                    table=table
                    set_columns=set_columns
                    on_mousedown=Rc::new(on_mousedown)
                    on_dragstart=Rc::new(on_dragstart)
                    on_drop=Rc::new(on_drop)
                />
                <TableRows columns=columns table=table rows=rows/>
            </table>
        </div>
    }
}

#[component]
pub fn InputCellNumber(tv: TypeValidation) -> impl IntoView {
    view! { <input type="number" value=""/> }
}

#[component]
pub fn InputCellText(tv: TypeValidation) -> impl IntoView {
    view! { <input type="text" value=""/> }
}
#[component]
pub fn InputCellDate(tv: TypeValidation) -> impl IntoView {
    view! { <input type="date" value=0/> }
}
#[component]
pub fn InputCellDateTime(tv: TypeValidation) -> impl IntoView {
    view! { <input type="datetime-local" value=0/> }
}
#[component]
pub fn InputCellEmail(tv: TypeValidation) -> impl IntoView {
    view! { <input type="email" value=""/> }
}
#[component]
pub fn InputCellUrl(tv: TypeValidation) -> impl IntoView {
    view! { <input type="url" value=""/> }
}
#[component]
pub fn InputCellAttachment(tv: TypeValidation) -> impl IntoView {
    view! { Attachment }
}
#[component]
pub fn InputCellMultipleSelect(tv: TypeValidation) -> impl IntoView {
    view! { MultipleSelect }
}
#[component]
pub fn InputCellSingleSelect(tv: TypeValidation) -> impl IntoView {
    view! { SingleSelect }
}
#[component]
pub fn InputCellPhoneNumber(tv: TypeValidation) -> impl IntoView {
    view! { <input type="text" value=""/> }
}
#[component]
pub fn InputCellCurrency(tv: TypeValidation) -> impl IntoView {
    view! { <input type="number" value=""/> }
}
#[component]
pub fn InputCellPercentage(tv: TypeValidation) -> impl IntoView {
    view! { <input type="number" value=""/> }
}
#[component]
pub fn InputCellCreatedBy(tv: TypeValidation) -> impl IntoView {
    view! { CreatedBy }
}
#[component]
pub fn InputCellLastModifiedBy(tv: TypeValidation) -> impl IntoView {
    view! { LastModifiedBy }
}
#[component]
pub fn InputCellAutoNumber(tv: TypeValidation) -> impl IntoView {
    view! { AutoNumber }
}
#[component]
pub fn InputCellFormula(tv: TypeValidation) -> impl IntoView {
    view! { Formula }
}
#[component]
pub fn InputCellCheckbox(tv: TypeValidation) -> impl IntoView {
    view! { <input type="checkbox" value=""/> }
}
#[component]
pub fn InputCellUser(tv: TypeValidation) -> impl IntoView {
    view! { User }
}
#[component]
pub fn InputCellCreatedAt(tv: TypeValidation) -> impl IntoView {
    view! { CreatedAt }
}
#[component]
pub fn InputCellUpdatedAt(tv: TypeValidation) -> impl IntoView {
    view! { UpdatedAt }
}
#[component]
pub fn InputCellRating(tv: TypeValidation) -> impl IntoView {
    view! { <input type="number" value=""/> }
}
#[component]
pub fn InputCellProgressBar(tv: TypeValidation) -> impl IntoView {
    view! { <input type="range" value=""/> }
}
