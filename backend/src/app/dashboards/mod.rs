use std::fmt::{self, Display, Formatter};

use chrono::Utc;
use diesel::PgConnection;
use serde::{Deserialize, Serialize};

use crate::repository::models::{
    Dashboard, DashboardChangeset, DashboardView, DashboardWidget, DashboardWidgetChangeset,
    WidgetTypes,
};

#[derive(Debug, Deserialize, Serialize)]
pub struct Settings {
    pub version: u8,
    pub widgets: Vec<Widget>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Widget {
    #[serde(rename = "widID")]
    pub wid_id: i64,
    #[serde(rename = "type")]
    pub type_: WidgetTypes,
    pub widget_configuration: Option<serde_json::Value>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TabsWidgetConfiguration {
    pub tabs_config: TabsConfig,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TabsConfig {
    pub tabs: Vec<Tab>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Tab {
    pub name: String,
    pub default: Option<bool>,
    #[serde(rename = "dashboardID")]
    pub dashboard_id: i64,
    pub condition_value: i64,
}

#[derive(Debug, Deserialize, Serialize)]
pub enum DashboardWriteError {
    InvalidSettings(String),
    ErrorRunningTransaction(String),
    CouldNotCreateDashboard(String),
    CouldNotCreateDashboardWidget(String),
    CouldNotDeleteWidgets(String),
    NoDashboardFound(String),
    CouldNotUpdateDashboard(String),
}

impl Display for DashboardWriteError {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        match self {
            DashboardWriteError::InvalidSettings(msg) => {
                write!(f, "Invalid settings: {}", msg)
            }
            DashboardWriteError::CouldNotCreateDashboard(msg) => {
                write!(f, "Could not create dashboard: {}", msg)
            }
            DashboardWriteError::ErrorRunningTransaction(msg) => {
                write!(f, "Error running transaction: {}", msg)
            }
            DashboardWriteError::CouldNotCreateDashboardWidget(msg) => {
                write!(f, "Could not create dashboard widget: {}", msg)
            }
            DashboardWriteError::CouldNotDeleteWidgets(msg) => {
                write!(f, "Could not delete dashboard widgets: {}", msg)
            }
            DashboardWriteError::NoDashboardFound(msg) => {
                write!(f, "No dashboard was found: {}", msg)
            }
            DashboardWriteError::CouldNotUpdateDashboard(msg) => {
                write!(f, "Could not update dashboard: {}", msg)
            }
        }
    }
}
impl std::error::Error for DashboardWriteError {}

impl From<diesel::result::Error> for DashboardWriteError {
    fn from(err: diesel::result::Error) -> Self {
        DashboardWriteError::ErrorRunningTransaction(err.to_string())
    }
}

pub fn update(
    conn: &mut PgConnection,
    id: i64,
    dc: &mut DashboardChangeset,
) -> Result<DashboardView, DashboardWriteError> {
    let dashboard = conn
        .build_transaction()
        .run::<_, DashboardWriteError, _>(|conn| {
            let dashboard = Dashboard::find(conn, id)
                .map_err(|err| DashboardWriteError::NoDashboardFound(err.to_string()))?;
            set_update_defaults(dc, dashboard);

            let dashboard = Dashboard::update(conn, id, dc.to_owned())
                .map_err(|err| DashboardWriteError::CouldNotUpdateDashboard(err.to_string()))?;

            sync_widgets(dc, &dashboard, conn)?;
            Ok(dashboard)
        })?;
    Ok(DashboardView::from_model(&dashboard))
}

pub fn create(
    conn: &mut PgConnection,
    dc: &mut DashboardChangeset,
    current_user_id: i64,
) -> Result<DashboardView, DashboardWriteError> {
    set_create_defaults(dc, current_user_id);

    let dashboard = conn
        .build_transaction()
        .run::<_, DashboardWriteError, _>(|conn| {
            let dashboard = Dashboard::create(conn, dc.to_owned())
                .map_err(|err| DashboardWriteError::CouldNotCreateDashboard(err.to_string()))?;

            sync_widgets(dc, &dashboard, conn)?;
            Ok(dashboard)
        })?;
    Ok(DashboardView::from_model(&dashboard))
}

fn set_update_defaults(dc: &mut DashboardChangeset, dashboard: Dashboard) {
    dc.owner_id = dashboard.owner_id;
    dc.shareable_link = dashboard.shareable_link;
    dc.inserted_at = dashboard.inserted_at;
    dc.updated_at = Utc::now().naive_utc();

    if dc.settings.is_none() {
        dc.settings = Some(
            serde_json::to_value(Settings {
                version: 2,
                widgets: vec![],
            })
            .unwrap(),
        );
    }
}

fn set_create_defaults(dc: &mut DashboardChangeset, current_user_id: i64) {
    dc.owner_id = Some(current_user_id);
    dc.shareable_link = Some(uuid::Uuid::new_v4());
    dc.inserted_at = Utc::now().naive_utc();
    dc.updated_at = Utc::now().naive_utc();

    if dc.settings.is_none() {
        dc.settings = Some(
            serde_json::to_value(Settings {
                version: 2,
                widgets: vec![],
            })
            .unwrap(),
        );
    }
}

fn sync_widgets(
    dc: &mut DashboardChangeset,
    dashboard: &Dashboard,
    conn: &mut PgConnection,
) -> Result<(), DashboardWriteError> {
    let settings: Settings = serde_json::from_value(dc.settings.clone().unwrap())
        .map_err(|err| DashboardWriteError::InvalidSettings(err.to_string()))?;
    DashboardWidget::delete_by_dashboard_id(conn, dashboard.id as i64)
        .map_err(|err| DashboardWriteError::CouldNotDeleteWidgets(err.to_string()))?;

    Ok(for wid in &settings.widgets {
        match wid.type_ {
            WidgetTypes::Tabs => {
                let config: TabsWidgetConfiguration =
                    serde_json::from_value(wid.widget_configuration.clone().unwrap_or_default())
                        .map_err(|err| DashboardWriteError::InvalidSettings(err.to_string()))?;
                config.tabs_config.tabs.iter().for_each(|tab| {
                    save_widget(
                        dashboard,
                        &Widget {
                            wid_id: tab.dashboard_id,
                            type_: WidgetTypes::Tabs,
                            widget_configuration: None,
                        },
                        conn,
                    );
                });
            }
            _ => {
                save_widget(dashboard, wid, conn);
            }
        }
    })
}

fn save_widget(
    dashboard: &Dashboard,
    wid: &Widget,
    conn: &mut PgConnection,
) -> Result<(), DashboardWriteError> {
    let wc = DashboardWidgetChangeset {
        dashboard_id: Some(dashboard.id as i64),
        widget_id: Some(wid.wid_id),
        widget_type: Some(wid.type_.clone()),
        inserted_at: Utc::now().naive_utc(),
        updated_at: Utc::now().naive_utc(),
    };
    DashboardWidget::find_or_create(conn, &wc)
        .map_err(|err| DashboardWriteError::CouldNotCreateDashboardWidget(err.to_string()))?;
    Ok(())
}
