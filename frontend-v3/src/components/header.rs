use icondata as i;
use leptos::*;
use leptos_icons::*;
use leptos_router::*;
use web_sys::{console, HtmlElement, MouseEvent};

#[component]
pub fn Sidebar() -> impl IntoView {
    // Define component state
    let size = "1.4em";
    let (expanded, set_expanded) = create_signal(false);
    let (dashboards_menu_open, set_dashboards_menu_open) = create_signal(false);
    let (more_menu_open, set_more_menu_open) = create_signal(false);
    let (user_menu_open, set_user_menu_open) = create_signal(false);

    // Define event handlers
    let toggle_expanded = move |_: bool| set_expanded.update(|expanded| *expanded = !*expanded);
    let toggle_dashboards_menu =
        move |_: bool| set_dashboards_menu_open.update(|open| *open = !*open);
    let toggle_more_menu = move |_: bool| set_more_menu_open.update(|open| *open = !*open);
    let toggle_user_menu = move |_: bool| set_user_menu_open.update(|open| *open = !*open);

    // Render component
    view! {
        <nav
            on:mouseenter=move |_| { set_expanded.set(true) }
            on:mouseleave=move |_| { set_expanded.set(false) }
            class=move || {
                let classes = "slide-transition tw-block tw-flex tw-flex-col tw-bg-white tw-text-default/80 tw-justify-between tw-leading-4 tw-border-r tw-h-[calc(100vh-45px)]";
                if expanded.get() {
                    format!("{} {}", classes, "tw-w-[250px]")
                } else {
                    format!("{} {}", classes, "tw-w-[50px]")
                }
            }
        >

            {move || {
                if !expanded.get() {
                    view! {
                        <div class="tw-block">
                            <div class="tw-flex tw-items-center tw-justify-center tw-py-4 tw-px-2">
                                <img class="tw-w-8 tw-h-8 tw-fill-primary" src="/apps/logo.png"/>
                            </div>
                            <ul
                                class="tw-flex tw-flex-col tw-items-start tw-justify-center tw-divide-y"
                                role="menu"
                            >
                                <div
                                    class="tw-flex tw-gap-2 tw-items-center menu-item tw-px-4 tw-py-2"
                                    role="menuitem"
                                >
                                    <Icon
                                        height=size
                                        width=size

                                        icon=i::TbLayoutDashboard
                                        class="tw-text-lg"
                                    />
                                </div>
                                <div
                                    class="tw-flex tw-gap-2 tw-items-center menu-item tw-px-4 tw-py-2"
                                    role="menuitem"
                                >
                                    <div class="tw-flex tw-gap-2 tw-items-center tw-rounded-full tw-border-2 ">
                                        Q
                                    </div>
                                </div>
                                <div
                                    class="tw-flex tw-gap-2 tw-items-center menu-item tw-px-4 tw-py-2"
                                    role="menuitem"
                                >
                                    <Icon
                                        height=size
                                        width=size
                                        icon=i::AiPlusCircleOutlined
                                        class="tw-flex tw-gap-2 tw-items-center"
                                    />

                                </div>
                                <div
                                    class="tw-flex tw-gap-2 tw-items-center menu-item tw-px-4 tw-py-2"
                                    role="menuitem"
                                >
                                    <Icon
                                        height=size
                                        width=size
                                        icon=i::TbCategory
                                        class="tw-flex tw-gap-2 tw-items-center "
                                    />
                                </div>
                            </ul>
                        </div>
                    }
                } else {
                    view! {
                        <div class="tw-block tw-flex tw-flex-col tw-gap-2">

                            <div class="tw-flex tw-items-center tw-justify-center tw-py-4 tw-px-2">
                                <img class="tw-w-8 tw-h-8 tw-fill-primary" src="/apps/logo.png"/>
                            </div>
                            <ul
                                class="tw-flex tw-flex-col tw-items-center tw-justify-center "
                                role="menu"
                            >
                                <div
                                    class="tw-flex tw-gap-2 tw-items-center menu-item tw-px-4 tw-py-3"
                                    role="menuitem"
                                >
                                    <Icon
                                        icon=i::TbLayoutDashboard
                                        class="tw-flex tw-gap-2 tw-items-center "
                                    />
                                    <div class="">Dashboards</div>
                                </div>
                                <div
                                    class="tw-flex tw-gap-2 tw-items-center menu-item tw-px-4 tw-py-3"
                                    role="menuitem"
                                >
                                    <div class="tw-flex tw-gap-2 tw-items-center tw-rounded-full tw-border-2">
                                        Q
                                    </div>
                                    Questions
                                </div>
                                <div
                                    class="tw-flex tw-gap-2 tw-items-center menu-item tw-px-4 tw-py-3 tw-no-wrap"
                                    role="menuitem"
                                >
                                    <Icon
                                        icon=i::AiPlusCircleOutlined

                                        class="tw-flex tw-gap-2 tw-items-center "
                                    />
                                    New Question
                                </div>
                                <div
                                    class="tw-flex tw-gap-2 tw-items-center menu-item tw-px-4 tw-py-3"
                                    role="menuitem"
                                >
                                    <Icon
                                        icon=i::TbCategory
                                        class="tw-flex tw-gap-2 tw-items-center "
                                    />
                                    More
                                </div>
                            </ul>
                        </div>
                    }
                }
            }}

            <ul cass="tw-flex tw-items-center tw-w-full">
                <li
                    class="tw-w-full"
                    class:tw-items-center=!expanded.get()
                    on:click=move |_| set_user_menu_open.set(!user_menu_open.get())
                >// ... (user menu items)
                </li>
            </ul>
        </nav>
    }
}
