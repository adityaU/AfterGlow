use leptos::*;
use leptos_router::*;
use web_sys::MouseEvent;

#[component]
fn AGWithLoginHeader() -> impl IntoView {
    let (expanded, set_expanded) = create_signal(false);
    let (dashboards_menu_open, set_dashboards_menu_open) = create_signal(false);
    let (more_menu_open, set_more_menu_open) = create_signal(false);
    let (user_menu_open, set_user_menu_open) = create_signal(false);
    let (permissions, set_permissions) = create_signal(Permissions::default()); // Replace with actual permissions data
    let (session, set_session) = create_signal(Session::default()); // Replace with actual session data
    let (dashboards, set_dashboards) = create_signal(Vec::<Dashboard>::new());

    // Fetch dashboards on mount
    create_effect(move |_| {
        if !session.get().token.is_empty() {
            fetch_dashboards(session.get().token.clone(), set_dashboards.clone());
        }
    });

    let icon_size = move || {
        if expanded.get() {
            28
        } else if window().unwrap().inner_width().unwrap().as_f64().unwrap() > 1920.0 {
            28
        } else {
            24
        }
    };

    let current_user = move || permissions.get().get_details();

    let current_user_initials = move || {
        current_user()
            .email
            .chars()
            .next()
            .map(|c| c.to_uppercase().collect::<String>())
            .unwrap_or_default()
    };

    view! {
        <nav
            class="slide-transition tw-flex tw-flex-col tw-bg-white tw-text-default/80 tw-justify-between tw-leading-4 tw-border-r"
            class:"tw-w-[254px]"=expanded.get()
            class:"tw-w-[50px]"=!expanded.get()
            on:mouseenter=move |_| set_expanded(true)
            on:mouseleave=move |_| set_expanded(false)
        >
            <ul class="tw-flex tw-flex-col tw-items-start tw-justify-center tw-divide-y">
                <li class="tw-px-4 tw-py-2 tw-mx-auto">
                    <A href="/questions/new?data=null">
                        <img src="/assets/images/logo.png" class="tw-h-12" class:"tw-h-[35px]"=expanded.get() class:"tw-w-[40px]"=expanded.get() class:"tw-h-[24px]"=!expanded.get() class:"tw-w-[28px]"=!expanded.get() />
                    </A>
                </li>
                <li class="tw-w-full">
                    <div class:"tw-flex"=true class:"tw-items-center"=!expanded.get() class:"tw-justify-center"=!expanded.get() class="tw-flex menu-item tw-px-4 tw-gap-2 tw-py-2 tw-items-center tw-cursor-pointer"
                        on:click=move |_| set_dashboards_menu_open(!dashboards_menu_open.get())>
                        <LayoutBoardIcon size=icon_size() class:"icon-primary"=expanded.get() />
                        {move || if expanded.get() { view! { <div>"Dashboards"</div> } } else { view! { <div></div> } }}
                        {move || if !dashboards_menu_open.get() && expanded.get() { view! { <ChevronDownIcon size="16" /> } } else { view! { <ChevronRightIcon size="16" /> } }}
                    </div>
                    <Transition>
                        <div class="tw-bg-secondary" class:"tw-bg-secondary"=dashboards_menu_open.get() && expanded.get()>
                            <For each=move || dashboards.get().clone() key=|dashboard| dashboard.id view=move |dashboard: Dashboard| {
                                view! {
                                    <A href=format!("/dashboards/{}", dashboard.id)>
                                        <div class="tw-py-2 tw-px-8 tw-flex tw-gap-2 tw-items-center tw-border-b-0 menu-item">
                                            <LayoutBoardIcon size="28" class="icon-primary" />
                                            <span class="tw-w-[150px] tw-truncate">{dashboard.title}</span>
                                        </div>
                                    </A>
                                }
                            } />
                            <A href="/dashboards">
                                <div class="tw-py-2 tw-px-8 tw-flex tw-gap-2 tw-items-center tw-border-b-0 menu-item">
                                    <StackIcon size="28" class="icon-primary" />
                                    "All Dashboards"
                                </div>
                            </A>
                        </div>
                    </Transition>
                </li>
                <li class="hover:tw-text-default tw-w-full">
                    <A href="/questions" class="tw-flex tw-gap-2 tw-items-center menu-item tw-px-4 tw-py-2"
                        class:"tw-flex"=true class:"tw-items-center"=!expanded.get() class:"tw-justify-center"=!expanded.get()>
                        <CircleLetterQIcon size=icon_size() class:"icon-primary"=expanded.get() />
                        {move || if expanded.get() { view! { <div>"Questions"</div> } } else { view! { <div></div> } }}
                    </A>
                </li>
                <li class="hover:tw-text-default tw-w-full" visible=permissions.get().can_create_question>
                    <A href="/questions/new?data=null" class="tw-flex tw-gap-2 tw-items-center menu-item tw-px-4 tw-py-2"
                        class:"tw-flex"=true class:"tw-items-center"=!expanded.get() class:"tw-justify-center"=!expanded.get()>
                        <CirclePlusIcon size=icon_size() class:"icon-primary"=expanded.get() />
                        {move || if expanded.get() { view! { <div>"New Question"</div> } } else { view! { <div></div> } }}
                    </A>
                </li>
                <li class="hover:tw-text-default tw-w-full" visible=permissions.get().can_create_question>
                    <A href="/data_references/databases" class="tw-flex tw-gap-2 tw-items-center menu-item tw-px-4 tw-py-2"
                        class:"tw-flex"=true class:"tw-items-center"=!expanded.get() class:"tw-justify-center"=!expanded.get()>
                        <DatabaseIcon size=icon_size() class:"icon-primary"=expanded.get() />
                        "Data Reference"
                    </A>
                </li>
                <li class="tw-w-full">
                    <div class="tw-flex tw-items-center tw-gap-2 tw-cursor-pointer tw-px-4 tw-py-2 menu-item"
                        visible=permissions.get().can_create_question
                        class:"tw-flex"=true class:"tw-items-center"=!expanded.get() class:"tw-justify-center"=!expanded.get()
                        on:click=move |_| set_more_menu_open(!more_menu_open.get())>
                        <CategoryIcon size=icon_size() class:"icon-primary"=expanded.get() />
                        {move || if expanded.get() { view! { <div>"More"</div> } } else { view! { <div></div> } }}
                        {move || if !more_menu_open.get() && expanded.get() { view! { <ChevronDownIcon size="16" /> } } else { view! { <ChevronRightIcon size="16" /> } }}
                    </div>
                    <Transition>
                        <div class="tw-bg-secondary" class:"tw-bg-secondary"=more_menu_open.get() && expanded.get()>
                            <A href="/data_references/databases">
                                <div class="tw-py-2 tw-px-8 tw-flex tw-gap-2 tw-items-center tw-border-b-0 menu-item">
                                    <DatabaseIcon size="28" class="icon-primary" />
                                    "Data Reference"
                                </div>
                            </A>
                            <A href="/snippets/">
                                <div class="tw-py-2 tw-px-8 tw-flex tw-gap-2 tw-items-center tw-border-b-0 menu-item" visible=permissions.get().can_edit_question>
                                    <CodePlusIcon size="28" class="icon-primary" />
                                    "Manage Snippets"
                                </div>
                            </A>
                        </div>
                    </Transition>
                </li>
            </ul>
            <ul class="tw-flex tw-items-center tw-justify-center tw-w-full">
                <li class="tw-w-full" class:"tw-items-center"=!expanded.get() on:click=move |_| set_user_menu_open(!user_menu_open.get())>
                    <Transition name="slide-opposite">
                        <div class="tw-bg-secondary" visible=user_menu_open.get() && expanded.get()>
                            <A href="/settings">
                                <div class="menu-item tw-border-t tw-py-2 tw-min-w-[150px]" visible=permissions.get().is_admin>
                                    <SettingsIcon size="28" class="icon-primary" />
                                    "Settings"
                                </div>
                            </A>
                            <A href="/user/configuration">
                                <div class="menu-item tw-border-t tw-py-2 tw-min-w-[150px]" visible=permissions.get().can_edit_question>
                                    <UserIcon size="28" class="icon-primary" />
                                    "User Configurations"
                                </div>
                            </A>
                            <div class="menu-item tw-border-t tw-py-2 tw-min-w-[150px]" on:click=logout>
                                <LogoutIcon size="28" class="icon-primary" />
                                "Logout"
                            </div>
                        </div>
                    </Transition>
                    <div class="tw-flex tw-flex-col tw-items-center tw-gap-2 tw-px-2 tw-py-2 tw-cursor-pointer">
                        {if current_user().profile_pic.is_some() {
                            view! {
                                <img class="tw-rounded-full tw-border-4" class:"tw-h-[40px]"=expanded.get() class:"tw-w-[40px]"=expanded.get() class:"tw-h-[28px]"=!expanded.get() class:"tw-w-[28px]"=!expanded.get() src=current_user().profile_pic.unwrap() />
                            }
                        } else {
                            view! {
                                <div class="tw-rounded-full tw-border-4 tw-flex tw-items-center tw-justify-center tw-bg-secondary tw-font-semibold tw-text-default"
                                    class:"tw-h-[40px]"=expanded.get() class:"tw-w-[40px]"=expanded.get() class:"tw-h-[28px]"=!expanded.get() class:"tw-w-[28px]"=!expanded.get()>
                                    {current_user_initials()}
                                </div>
                            }
                        }}
                        {if expanded.get() {
                            view! {
                                <div class="tw-flex tw-items-center tw-cursor-pointer">
                                    <div>{current_user().full_name.unwrap_or(current_user().email.clone())}</div>
                                    {if !user_menu_open.get() {
                                        view! { <ChevronDownIcon size="16" /> }
                                    } else {
                                        view! { <ChevronRightIcon size="16" /> }
                                    }}
                                </div>
                            }
                        } else {
                            view! { <div></div> }
                        }}
                    </div>
                </li>
            </ul>
        </nav>
    }
}

fn fetch_dashboards(token: String, set_dashboards: impl Fn(Vec<Dashboard>)) {
    // Fetch dashboards logic here
}

fn logout() {
    // Logout logic here
}

#[derive(Default)]
struct Permissions {
    // Define permissions structure
    can_create_question: bool,
    can_edit_question: bool,
    is_admin: bool,
    email: String,
}

impl Permissions {
    fn get_details(&self) -> User {
        // Fetch user details logic here
    }
}

#[derive(Default, Clone)]
struct Session {
    // Define session structure
    token: String,
}

#[derive(Default, Clone)]
struct Dashboard {
    // Define dashboard structure
    id: String,
    title: String,
}

#[derive(Default, Clone)]
struct User {
    // Define user structure
    profile_pic: Option<String>,
    full_name: Option<String>,
    email: String,
}
