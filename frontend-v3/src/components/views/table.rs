use std::{collections::HashMap, rc::Rc};

use common::models::{
    app_column::{AppColumnView, TypeValidation},
    app_table::AppTableView,
    row::RowElement,
};
use icondata as i;
use leptos::{html::Input, *};
use leptos_icons::Icon;
use web_sys::{
    console,
    wasm_bindgen::{JsCast, JsValue},
    DragEvent, HtmlElement, MouseEvent,
};

use crate::{
    apis::apps::create_empty_row,
    components::{self, base::floating_menu::FloatingMenu, columns::create::CreateColumn},
};

#[component]
pub fn TableHeaders(
    columns: ReadSignal<Rc<dyn Fn() -> Vec<AppColumnView>>>,
    set_columns: WriteSignal<Vec<AppColumnView>>,
    table: ReadSignal<Option<AppTableView>>,
    on_mousedown: Rc<dyn Fn(MouseEvent, usize)>,
    on_dragstart: Rc<dyn Fn(DragEvent, usize)>,
    on_drop: Rc<dyn Fn(DragEvent, usize)>,
) -> impl IntoView {
    let (open, set_open) = create_signal(false);

    view! {
        <thead class="tw-px-4">
            <th></th>

            <For
                each=move || { columns.get()().iter().cloned().enumerate().collect::<Vec<_>>() }
                key=|(index, column)| column.id
                children=move |(index, column)| {
                    let (open_menu, set_open_menu) = create_signal(false);
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

                            class=move || {
                                let mut classes = "tw-px-4 tw-py-2 tw-border tw-cursor-move"
                                    .to_string();
                                if column.is_primary {
                                    classes += "tw-font-bold tw-bg-primary/20";
                                }
                                classes
                            }
                        >

                            <div class="tw-flex tw-items-center tw-space-x-2">
                                {&column.name}
                                <Icon
                                    icon=i::TbChevronDown
                                    on:click=move |e| {
                                        e.prevent_default();
                                        e.stop_propagation();
                                        set_open_menu.set(!open_menu.get())
                                    }
                                />

                            </div>

                            <FloatingMenu show=open_menu set_show=set_open_menu>
                                <div class="menu-item tw-px-4">Make Primary Identifier</div>
                            </FloatingMenu>

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
    columns: ReadSignal<Rc<dyn Fn() -> Vec<AppColumnView>>>,
    table: ReadSignal<Option<AppTableView>>,
    rows: ReadSignal<Vec<Vec<RowElement>>>,
    set_rows: WriteSignal<Vec<Vec<RowElement>>>,
) -> impl IntoView {
    let (error_empty_row, set_error_empty_row) = create_signal("".to_string());

    async fn create_row(
        columns: ReadSignal<Rc<dyn Fn() -> Vec<AppColumnView>>>,
        table: ReadSignal<Option<AppTableView>>,
        set_rows: WriteSignal<Vec<Vec<RowElement>>>,
        set_error_empty_row: WriteSignal<String>,
    ) {
        let column_index_map: HashMap<_, _> = columns.get()()
            .iter()
            .enumerate()
            .map(|(i, col)| (col.real_name.clone(), i))
            .collect();

        // Reorder resp.row according to columns.real_name
        let columns_value = columns.get()().clone();
        let primary_identifier = columns_value.iter().find(|c| c.is_primary);
        match primary_identifier {
            Some(column) => match column.type_validation {
                TypeValidation::CreatedBy {}
                | TypeValidation::LastModifiedBy {}
                | TypeValidation::AutoNumber {}
                | TypeValidation::CreatedAt { .. }
                | TypeValidation::UpdatedAt { .. } => {
                    match create_empty_row(table.get().unwrap_or_default().id).await {
                        Ok(resp) => set_rows.update(|rows| {
                            let mut reordered_row = vec![RowElement::default(); resp.row.len()];

                            for (i, re) in resp.row.iter().enumerate() {
                                let index = column_index_map.get(&resp.columns[i]);
                                if let Some(index) = index {
                                    reordered_row[*index] = re.clone();
                                } else {
                                    continue;
                                }
                            }
                            rows.push(reordered_row);
                        }),
                        Err(err) => set_error_empty_row.set(err.to_string()),
                    }
                }
                _ => {
                    let mut row = vec![];
                    for column in columns.get()().iter() {
                        row.push(column.default_value());
                    }

                    set_rows.update(|rows| {
                        rows.push(row);
                    });
                }
            },
            None => set_error_empty_row
                .set("Primary Identifier is must for creating new rows".to_string()),
        };
    }

    let create_row_closure = {
        let columns = columns.clone();
        let table = table.clone();
        let set_rows = set_rows.clone();
        let set_error_empty_row = set_error_empty_row.clone();
        move |_| {
            let columns = columns.clone();
            let table = table.clone();
            let set_rows = set_rows.clone();
            let set_error_empty_row = set_error_empty_row.clone();
            spawn_local(async move {
                create_row(columns, table, set_rows, set_error_empty_row).await;
            });
        }
    };

    let row_view = move |(index, row_element): (_, RowElement)| {
        let column: AppColumnView = columns.get()().clone().get(index).cloned().unwrap();
        let (is_focus, set_is_focus) = create_signal(false);
        view! {
            <td
                class=move || {
                    let mut classes = "tw-border tw-px-4 tw-py-2 ".to_string();
                    if column.is_primary {
                        classes += "tw-font-bold tw-bg-primary/20";
                    }
                    classes
                }

                on:focusin=move |e| {
                    if let Some(element) = e.target().and_then(|t| t.dyn_into::<HtmlElement>().ok())
                    {
                        if let Some(td) = element.closest("td").ok().flatten() {
                            td.class_list().add_1("cell_focus").unwrap();
                        }
                    }
                }

                on:focusout=move |e| {
                    if let Some(element) = e.target().and_then(|t| t.dyn_into::<HtmlElement>().ok())
                    {
                        if let Some(td) = element.closest("td").ok().flatten() {
                            td.class_list().remove_1("cell_focus").unwrap();
                        }
                    }
                }
            >

                <RowDisplay
                    column=column
                    value=row_element
                    is_focus=is_focus
                    set_is_focus=set_is_focus
                />
            </td>
        }
    };

    view! {
        <tbody>
            <For
                each=move || { rows.get().iter().cloned().enumerate().collect::<Vec<_>>() }
                key=move |(index, _)| *index
                children=move |(index, row)| {
                    view! {
                        <tr>
                            <td class="tw-border tw-px-4 tw-py-2"></td>
                            <For
                                each=move || { row.iter().cloned().enumerate().collect::<Vec<_>>() }
                                key=move |(i, _)| *i
                                children=move |(i, row_element)| {
                                    view! { {row_view((i, row_element))} }
                                }
                            />

                        </tr>
                    }
                }
            />

            <tr class="tw-bg-secondary tw-border">

                <td class="tw-border tw-px-4 tw-py-2" on:click=create_row_closure>
                    <Icon icon=i::TbPlus/>
                </td>
                <For each=move || columns.get()().clone() key=move |column| column.id let:_>
                    <td class="tw-border tw-border-x-0 tw-px-4 tw-py-2"></td>
                </For>

                <td class="tw-border tw-px-4 tw-py-2"></td>
            </tr>

        </tbody>
    }
}
#[component]
pub fn Table(
    columns: ReadSignal<Vec<AppColumnView>>,
    set_columns: WriteSignal<Vec<AppColumnView>>,
    table: ReadSignal<Option<AppTableView>>,
    rows: ReadSignal<Vec<Vec<RowElement>>>,
    set_rows: WriteSignal<Vec<Vec<RowElement>>>,
) -> impl IntoView {
    let (start_x, set_start_x) = create_signal(0.0);
    let (start_width, set_start_width) = create_signal(0.0);
    let (dragging, set_dragging) = create_signal(false);
    let (drag_col_index, set_drag_col_index) = create_signal(0);

    let (columns, _) = create_signal(Rc::new(move || {
        let mut columns = columns.get().clone();
        columns.sort_by_key(|c| !c.is_primary);
        columns
    }) as Rc<dyn Fn() -> Vec<AppColumnView>>);

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
            let mut new_columns = columns.get()().clone();
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
        <div class="tw-px-4 tw-py-2 tw-w-full">
            <table class="tw-w-full tw-text-sm tw-text-left tw-px-4 tw-bg-white tw-border">
                // on:mousemove=on_mousemove
                // on:mouseup=on_mouseup
                <TableHeaders
                    columns=columns
                    table=table
                    set_columns=set_columns
                    on_mousedown=Rc::new(on_mousedown)
                    on_dragstart=Rc::new(on_dragstart)
                    on_drop=Rc::new(on_drop)
                />
                <TableRows columns=columns table=table rows=rows set_rows=set_rows/>
            </table>
        </div>
    }
}

#[component]
fn UnfocusedRowDisplay(
    tv: TypeValidation,
    v: RowElement,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    view! { <div on:click=move |_| set_is_focus.set(true)>{tv.format(v).to_string()}</div> }
}

#[component]
pub fn InputCellNumber(
    value: RowElement,
    tv: TypeValidation,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    let tv = store_value(tv);
    let value = store_value(value);
    let input_ref = create_node_ref::<Input>();
    create_effect(move |_| {
        console::log_1(&JsValue::from_str(
            format!("i was here 67611: {}", input_ref.get().is_some()).as_str(),
        ));

        if let Some(ref_input) = input_ref.get() {
            console::log_1(&JsValue::from_str(
                format!("i was here 67621: {}", input_ref.get().is_some()).as_str(),
            ));

            ref_input.focus().unwrap();
        }
    });
    view! {
        <Show
            when=move || is_focus.get()
            fallback=move || {
                view! {
                    <UnfocusedRowDisplay
                        tv=(move || { tv.with_value(|f| f.clone()) })()
                        v=(move || { value.with_value(|f| f.clone()) })()
                        set_is_focus=set_is_focus
                    />
                }
            }
        >

            <input
                class="cell_input"
                type="number"
                ref=input_ref
                value=move || value.with_value(|f| f.clone()).to_string()
                on:blur=move |_| set_is_focus.set(false)
            />

        </Show>
    }
}

#[component]
pub fn InputCellText(
    value: RowElement,
    tv: TypeValidation,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    view! { <input type="text" value=""/> }
}
#[component]
pub fn InputCellDate(
    value: RowElement,
    tv: TypeValidation,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    view! { <input type="date" value=0/> }
}
#[component]
pub fn InputCellDateTime(
    value: RowElement,
    tv: TypeValidation,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    view! { <input type="datetime-local" value=0/> }
}
#[component]
pub fn InputCellEmail(
    value: RowElement,
    tv: TypeValidation,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    view! { <input type="email" value=""/> }
}
#[component]
pub fn InputCellUrl(
    value: RowElement,
    tv: TypeValidation,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    view! { <input type="url" value=""/> }
}
#[component]
pub fn InputCellAttachment(
    value: RowElement,
    tv: TypeValidation,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    view! { Attachment }
}
#[component]
pub fn InputCellMultipleSelect(
    value: RowElement,
    tv: TypeValidation,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    view! { MultipleSelect }
}
#[component]
pub fn InputCellSingleSelect(
    value: RowElement,
    tv: TypeValidation,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    view! { {tv.format(value).to_string()} }
}
#[component]
pub fn InputCellPhoneNumber(
    value: RowElement,
    tv: TypeValidation,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    view! { <input type="text" value=""/> }
}
#[component]
pub fn InputCellCurrency(
    value: RowElement,
    tv: TypeValidation,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    view! { <input type="number" value=""/> }
}
#[component]
pub fn InputCellPercentage(
    value: RowElement,
    tv: TypeValidation,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    view! { <input type="number" value=""/> }
}
#[component]
pub fn InputCellCreatedBy(
    value: RowElement,
    tv: TypeValidation,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    view! {}
}
#[component]
pub fn InputCellLastModifiedBy(
    value: RowElement,
    tv: TypeValidation,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    view! { LastModifiedBy }
}
#[component]
pub fn InputCellAutoNumber(
    value: RowElement,
    tv: TypeValidation,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    view! { {tv.format(value).to_string()} }
}
#[component]
pub fn InputCellFormula(
    value: RowElement,
    tv: TypeValidation,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    view! { Formula }
}
#[component]
pub fn InputCellCheckbox(
    value: RowElement,
    tv: TypeValidation,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    view! { <input type="checkbox" value=""/> }
}
#[component]
pub fn InputCellUser(
    value: RowElement,
    tv: TypeValidation,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    view! { User }
}
#[component]
pub fn InputCellCreatedAt(
    value: RowElement,
    tv: TypeValidation,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    view! { {tv.format(value).to_string()} }
}
#[component]
pub fn InputCellUpdatedAt(
    value: RowElement,
    tv: TypeValidation,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    view! { {tv.format(value).to_string()} }
}
#[component]
pub fn InputCellRating(
    value: RowElement,
    tv: TypeValidation,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    view! { <input type="number" value=""/> }
}
#[component]
pub fn InputCellProgressBar(
    value: RowElement,
    tv: TypeValidation,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    view! { <input type="range" value=""/> }
}

#[component]
fn RowDisplay(
    column: AppColumnView,
    value: RowElement,
    is_focus: ReadSignal<bool>,
    set_is_focus: WriteSignal<bool>,
) -> impl IntoView {
    {
        match column.type_validation.get_type().as_str() {
            "number" => {
                view! {
                    <InputCellNumber
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
            "text" => {
                view! {
                    <InputCellText
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
            "date" => {
                view! {
                    <InputCellDate
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
            "datetime" => {
                view! {
                    <InputCellDateTime
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
            "email" => {
                view! {
                    <InputCellEmail
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
            "url" => {
                view! {
                    <InputCellUrl
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
            "attachment" => {
                view! {
                    <InputCellAttachment
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
            "multiple_select" => {
                view! {
                    <InputCellMultipleSelect
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
            "single_select" => {
                view! {
                    <InputCellSingleSelect
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
            "phone_number" => {
                view! {
                    <InputCellPhoneNumber
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
            "currency" => {
                view! {
                    <InputCellCurrency
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
            "percentage" => {
                view! {
                    <InputCellPercentage
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
            "created_by" => {
                view! {
                    <InputCellCreatedBy
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
            "last_modified_by" => {
                view! {
                    <InputCellLastModifiedBy
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
            "auto_number" => {
                view! {
                    <InputCellAutoNumber
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
            "formula" => {
                view! {
                    <InputCellFormula
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
            "checkbox" => {
                view! {
                    <InputCellCheckbox
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
            "user" => {
                view! {
                    <InputCellUser
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
            "created_at" => {
                view! {
                    <InputCellCreatedAt
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
            "updated_at" => {
                view! {
                    <InputCellUpdatedAt
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
            "rating" => {
                view! {
                    <InputCellRating
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
            "progress_bar" => {
                view! {
                    <InputCellProgressBar
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
            _ => {
                view! {
                    <InputCellText
                        is_focus=is_focus
                        set_is_focus=set_is_focus
                        value=value.clone()
                        tv=column.type_validation.clone()
                    />
                }
            }
        }
    }
}
