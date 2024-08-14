use icondata as i;
use leptos::*;
use leptos_icons::*;

use crate::apis::{
    self,
    dashboards::{Dashboard},
    session::Session,
};
use crate::components::chevron::Chevron;

pub const SIZE: &str = "28px";
pub const CHEVRON_SIZE: &str = "0.8em";

#[component]
pub fn Sidebar() -> impl IntoView {
    let session = expect_context::<Resource<(), Session>>();
    // Define component state
    let (expanded, set_expanded) = create_signal(false);
    let (dashboards_menu_open, set_dashboards_menu_open) = create_signal(false);
    let (more_menu_open, set_more_menu_open) = create_signal(false);
    let (user_menu_open, set_user_menu_open) = create_signal(false);

    // Define event handlers
    let dashboards = create_resource(
        || (),
        |_| async move { apis::dashboards::fetch_all().await },
    );

    // Render component
    view! {
        <nav
            on:mouseenter=move |_| {
                if !expanded.get() {
                    set_expanded.set(true)
                }
            }

            on:mouseleave=move |_| {
                if expanded.get() {
                    set_expanded.set(false)
                }
            }

            class=move || {
                let classes = "slide-transition tw-font-semibold tw-flex tw-flex-col tw-bg-white tw-text-default/80 tw-justify-between tw-leading-4 tw-border-r tw-h-[calc(100vh-45px)]";
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
                                class="tw-flex tw-flex-col tw-items-start tw-justify-center"
                                role="menu"
                            >
                                <div
                                    class="tw-flex tw-gap-2 tw-items-center menu-item tw-px-4 tw-py-2"
                                    role="menuitem"
                                >
                                    <Icon
                                        height=SIZE
                                        width=SIZE

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
                                        height=SIZE
                                        width=SIZE
                                        icon=i::AiPlusCircleOutlined
                                        class="tw-flex tw-gap-2 tw-items-center"
                                    />

                                </div>
                                <div
                                    class="tw-flex tw-gap-2 tw-items-center menu-item tw-px-4 tw-py-2"
                                    role="menuitem"
                                >
                                    <Icon
                                        height=SIZE
                                        width=SIZE
                                        icon=i::TbCategory
                                        class="tw-flex tw-gap-2 tw-items-center "
                                    />
                                </div>
                            </ul>
                        </div>
                    }
                } else {
                    view! {
                        <div class="tw-flex tw-flex-col tw-gap-2">

                            <div class="tw-flex tw-items-center tw-justify-center tw-py-4 tw-px-2">
                                <img class="tw-w-8 tw-h-8 tw-fill-primary" src="/apps/logo.png"/>
                            </div>
                            <ul
                                class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-flex-1 "
                                role="menu"
                            >
                                <div
                                    class="tw-flex tw-gap-2 tw-items-center menu-item tw-px-4 tw-py-3"
                                    role="menuitem"
                                    on:click=move |_| {
                                        set_dashboards_menu_open.set(!dashboards_menu_open.get())
                                    }
                                >

                                    <Icon
                                        icon=i::TbLayoutDashboard
                                        width=SIZE
                                        height=SIZE

                                        class="tw-flex tw-gap-2 tw-items-center icon-primary "
                                    />
                                    <div class="">Dashboards</div>
                                    <Chevron
                                        toggle_read=dashboards_menu_open
                                        size=CHEVRON_SIZE.to_string()
                                    />

                                </div>
                                <SidebarDeshboardMenuItems
                                    dashboards=dashboards.get().unwrap_or_default()
                                    dashboards_menu_open=dashboards_menu_open
                                />

                                <div
                                    class="tw-flex tw-gap-2 tw-items-center menu-item tw-px-4 tw-py-3"
                                    role="menuitem"
                                >
                                    <div class="tw-flex tw-gap-2 tw-items-center tw-rounded-full tw-border-2 text-icon-primary">
                                        Q
                                    </div>
                                    Questions
                                </div>
                                <div
                                    class="tw-flex tw-gap-2 tw-items-center menu-item tw-px-4 tw-py-3 tw-no-wrap"
                                    role="menuitem"
                                >
                                    <Icon
                                        class="icon-primary"
                                        icon=i::AiPlusCircleOutlined
                                        width=SIZE
                                        height=SIZE
                                    />

                                    New Question
                                </div>
                                <div
                                    class="tw-flex tw-gap-2 tw-items-center menu-item tw-px-4 tw-py-3"
                                    role="menuitem"
                                    on:click=move |_| {
                                        set_more_menu_open.set(!more_menu_open.get())
                                    }
                                >

                                    <Icon
                                        icon=i::TbCategory
                                        class="icon-primary"
                                        width=SIZE
                                        height=SIZE
                                    />
                                    More

                                    <Chevron
                                        toggle_read=more_menu_open
                                        size=CHEVRON_SIZE.to_string()
                                    />
                                </div>
                                <SidebarMoreMenuItems more_menu_open=more_menu_open/>
                            </ul>
                        </div>
                    }
                }
            }}

            {move || match session.get() {
                None => view! { <p>"Loading..."</p> }.into_view(),
                Some(sess) => {
                    view! {
                        <SidebarUserMenu
                            expanded=expanded
                            session=sess
                            user_menu_open=user_menu_open
                            set_user_menu_open=set_user_menu_open
                        />
                    }
                        .into_view()
                }
            }}

        </nav>
    }
}

#[component]
pub fn SidebarUserMenu(
    expanded: ReadSignal<bool>,
    user_menu_open: ReadSignal<bool>,
    set_user_menu_open: WriteSignal<bool>,
    session: Session,
) -> impl IntoView {
    view! {
        <ul class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full slide-up">
            <SidebarUserMenuItems user_menu_open=user_menu_open/>
            <div class="tw-flex tw-flex-col tw-items-center tw-gap-2 tw-px-2 tw-py-2 tw-cursor-pointer">
                <img
                    class=move || {
                        let classes = "tw-rounded-full tw-border-4";
                        if expanded.get() {
                            format!("{} {}", classes, "tw-h-[40px] tw-w-[40px]")
                        } else {
                            format!("{} {}", classes, "tw-h-[28px] tw-w-[28px]")
                        }
                    }

                    src=session.user.profile_pic
                />
                {move || {
                    if expanded.get() {
                        view! {
                            <div
                                class="tw-flex tw-items-center tw-cursor-pointer tw-no-wrap"
                                on:click=move |_| { set_user_menu_open.set(!user_menu_open.get()) }
                            >

                                <div>
                                    {if !session.user.full_name.is_empty() {
                                        session.user.full_name.clone()
                                    } else {
                                        session.user.email.clone()
                                    }}

                                </div>
                                <Chevron toggle_read=user_menu_open size=CHEVRON_SIZE.to_string()/>
                            </div>
                        }
                    } else {
                        view! { <div class="tw-hidden"></div> }
                    }
                }}

            </div>
        </ul>
    }
}

#[component]
pub fn SidebarDeshboardMenuItems(
    dashboards: Vec<Dashboard>,
    dashboards_menu_open: ReadSignal<bool>,
) -> impl IntoView {
    let menu_items: Vec<_> = dashboards
        .iter()
        .map(|dashboard| {
            view! {
                <a href=format!("/dashboards/{}", dashboard.id)>
                    <div class="tw-py-2 tw-px-8 tw-flex tw-gap-2 tw-items-center tw-border-b-0 menu-item">
                        <Icon
                            icon=i::TbLayoutDashboard
                            width=SIZE
                            height=SIZE
                            class="tw-flex tw-gap-2 tw-items-center icon-primary"
                        />
                        <span class="tw-w-[150px] tw-truncate">{dashboard.title.clone()}</span>
                    </div>
                </a>
            }
        })
        .collect();

    view! {
        {move || {
            if !dashboards_menu_open.get() {
                view! {
                    <ul class="tw-bg-secondary tw-w-full">
                        {menu_items.clone()} <a href="/dashboards/">
                            <div class="tw-py-2 tw-px-8 tw-flex tw-gap-2 tw-items-center tw-border-b-0 menu-item">
                                <Icon
                                    width=SIZE
                                    height=SIZE
                                    icon=i::TbLayoutDashboard
                                    class="tw-flex tw-gap-2 tw-items-center icon-primary"
                                />
                                <span class="tw-w-[150px] tw-truncate">All Dashboards</span>
                            </div>
                        </a>
                    </ul>
                }
                    .into_view()
            } else {
                view! { <ul class="tw-hidden"></ul> }.into_view()
            }
        }}
    }
}

#[component]
pub fn SidebarMoreMenuItems(more_menu_open: ReadSignal<bool>) -> impl IntoView {
    view! {
        {move || {
            if more_menu_open.get() {
                view! {
                    <ul class="tw-bg-secondary tw-w-full tw-flex tw-flex-col tw-items-start tw-justify-center tw-divide-y">
                        <a href="/data_references/">
                            <div class="tw-py-2 tw-px-8 tw-flex tw-gap-2 tw-items-center tw-border-b-0 menu-item">
                                <Icon
                                    icon=i::TbDatabase
                                    width=SIZE
                                    height=SIZE
                                    class="tw-flex tw-gap-2 tw-items-center icon-primary"
                                />
                                <span class="tw-w-[150px] tw-truncate">"Data Reference"</span>
                            </div>
                        </a>
                        <a href="/snippets/">
                            <div class="tw-py-2 tw-px-8 tw-flex tw-gap-2 tw-items-center tw-border-b-0 menu-item">
                                <Icon
                                    icon=i::TbCodePlus
                                    width=SIZE
                                    height=SIZE
                                    class="tw-flex tw-gap-2 tw-items-center icon-primary"
                                />
                                <span class="tw-w-[150px] tw-truncate">"Manage Snippets"</span>
                            </div>
                        </a>
                    </ul>
                }
                    .into_view()
            } else {
                view! { <ul class="tw-hidden"></ul> }.into_view()
            }
        }}
    }
}

#[component]
pub fn SidebarUserMenuItems(user_menu_open: ReadSignal<bool>) -> impl IntoView {
    view! {
        {move || {
            if user_menu_open.get() {
                view! {
                    <ul class="tw-bg-secondary tw-w-full tw-flex tw-flex-col tw-items-start tw-justify-center tw-divide-y slide-up">
                        <a href="/settings/">
                            <div class="tw-py-2 tw-px-8 tw-flex tw-gap-2 tw-items-center tw-border-b-0 menu-item">
                                <Icon
                                    icon=i::TbSettings
                                    width=SIZE
                                    height=SIZE
                                    class="tw-flex tw-gap-2 tw-items-center icon-primary"
                                />
                                <span class="tw-w-[150px] tw-truncate">Settings</span>
                            </div>
                        </a>
                        <a href="/user_configurations/">
                            <div class="tw-py-2 tw-px-8 tw-flex tw-gap-2 tw-items-center tw-border-b-0 menu-item">
                                <Icon
                                    icon=i::TbUser
                                    width=SIZE
                                    height=SIZE
                                    class="tw-flex tw-gap-2 tw-items-center icon-primary"
                                />
                                <span class="tw-w-[150px] tw-truncate">User Configuration</span>
                            </div>
                        </a>
                        <div class="tw-py-2 tw-px-8 tw-flex tw-gap-2 tw-items-center tw-border-b-0 menu-item">
                            <Icon
                                icon=i::TbLogout
                                width=SIZE
                                height=SIZE
                                class="tw-flex tw-gap-2 tw-items-center icon-primary"
                            />
                            <span class="tw-w-[150px] tw-truncate">Logout</span>
                        </div>
                    </ul>
                }
                    .into_view()
            } else {
                view! { <ul class="tw-hidden"></ul> }.into_view()
            }
        }}
    }
}
