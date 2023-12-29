use super::models::{DashboardWidget, DashboardWidgetChangeset, Variable, WidgetTypes};
use super::schema::{dashboard_widgets, variables, visualizations};
use super::{models::Dashboard, schema::dashboards};

use diesel::dsl::sql;

use diesel::prelude::*;
use diesel::result::Error;
use diesel::sql_types::{BigInt, Bool, Nullable};

impl dashboards::table {
    pub fn shared_with_user(user_email: String, permissions: Vec<String>) -> String {
        if permissions.contains(&"Settings.all".to_string()) {
            return "dashboards.id = ANY(select dashboards.id from dashboards)".into();
        }

        format!("dashboards.id = ANY(select dashboards.id from dashboards
            left join dashboard_widgets
            on dashboards.id = dashboard_widgets.widget_id and dashboard_widgets.widget_type = 'tabs'
            left join dashboards db
            on db.id = dashboard_widgets.dashboard_id
            left join users 
            on dashboards.owner_id = users.id
            where (users.email = '{}'
            or '{}' = ANY(db.shared_to)
            or 'all' = ANY(db.shared_to)
            or '{}' = ANY(dashboards.shared_to)
            or 'all' = ANY(dashboards.shared_to))  
            group by 1)", user_email, user_email, user_email)
    }
}

impl Dashboard {
    pub fn search(
        conn: &mut PgConnection,
        query: &str,
        user_email: String,
        permissions: Vec<String>,
    ) -> Result<Vec<Self>, Error> {
        dashboards::table
            .filter(sql::<Bool>(
                dashboards::table::shared_with_user(user_email, permissions).as_str(),
            ))
            .filter(dashboards::title.ilike(format!("%{}%", query)))
            .load::<Self>(conn)
    }
    pub fn sorted_index(
        conn: &mut PgConnection,
        user_email: String,
        permissions: Vec<String>,
        limit: Option<i64>,
    ) -> Result<Vec<Self>, Error> {
        let query = dashboards::table
            .filter(sql::<Bool>(
                dashboards::table::shared_with_user(user_email, permissions).as_str(),
            ))
            .order(dashboards::title.asc())
            .into_boxed();
        let query = if let Some(limit) = limit {
            query.limit(limit)
        } else {
            query
        };
        query.load::<Self>(conn)
    }

    pub fn scoped_find(
        conn: &mut PgConnection,
        id: i64,
        user_email: String,
        permissions: Vec<String>,
    ) -> Result<Self, Error> {
        dashboards::table
            .filter(sql::<Bool>(
                dashboards::table::shared_with_user(user_email, permissions).as_str(),
            ))
            .filter(dashboards::id.eq(id))
            .first::<Self>(conn)
    }

    pub fn fetch_possible_variables(
        conn: &mut PgConnection,
        did: i64,
    ) -> Result<Vec<Variable>, Error> {
        dashboard_widgets::table
            .filter(dashboard_widgets::dashboard_id.nullable().eq(did as i64))
            .filter(dashboard_widgets::widget_type.eq(WidgetTypes::Visualization))
            .inner_join(
                visualizations::table.on(visualizations::id
                    .nullable()
                    .eq(dashboard_widgets::widget_id)),
            )
            .inner_join(variables::table.on(
                visualizations::question_id.eq(sql::<Nullable<BigInt>>("variables.question_id")),
            ))
            .select(variables::all_columns)
            .load::<Variable>(conn)
    }
}

impl DashboardWidget {
    pub fn find_by_unique(
        conn: &mut PgConnection,
        dashboard_id: i64,
        widget_id: i64,
        widget_type: WidgetTypes,
    ) -> Result<Self, Error> {
        dashboard_widgets::table
            .filter(
                dashboard_widgets::dashboard_id
                    .eq(dashboard_id)
                    .and(dashboard_widgets::widget_id.eq(widget_id))
                    .and(dashboard_widgets::widget_type.eq(widget_type)),
            )
            .first::<Self>(conn)
    }
    pub fn find_or_create(
        conn: &mut PgConnection,
        dwc: &DashboardWidgetChangeset,
    ) -> Result<Self, Error> {
        let widget = Self::find_by_unique(
            conn,
            dwc.dashboard_id.unwrap_or(0i64),
            dwc.widget_id.unwrap_or(0i64),
            dwc.widget_type.clone().unwrap_or_default(),
        );
        match widget {
            Ok(widget) => Ok(widget),
            Err(_) => Self::create(conn, dwc.clone()),
        }
    }

    pub fn delete_by_dashboard_id(conn: &mut PgConnection, dashboard_id: i64) -> Result<(), Error> {
        diesel::delete(
            dashboard_widgets::table.filter(dashboard_widgets::dashboard_id.eq(dashboard_id)),
        )
        .execute(conn)?;
        Ok(())
    }
}
