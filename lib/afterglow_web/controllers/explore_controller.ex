defmodule AfterGlow.ExploreController do
  use AfterGlow.Web, :controller
  alias AfterGlow.Explorations
  alias AfterGlow.Explorations.Dashboards
  alias AfterGlow.DashboardView
  alias AfterGlow.Plugs.Authorization
  alias AfterGlow.Settings.ApplicableSettings
  plug(Authorization)

  action_fallback(AfterGlow.Web.FallbackController)

  def get_row_view(conn, %{"column_id" => column_id, "value" => value}) do
    frontend_limit = ApplicableSettings.max_frontend_limit(conn.assigns.current_user)

    conn
    |> json(
      Explorations.get_row_and_dependencies(
        column_id,
        value,
        frontend_limit,
        %{
          current_user: conn.assigns.current_user,
          explore_view_column_id: column_id,
          explore_view_value: value,
        }

      )
    )
  end

  def get_dependency_view(conn, %{
        "column_id" => column_id,
        "value" => value,
        "table_id" => table_id,
        "foreign_column_id" => foreign_column_id,
        "value_column_id" => value_column_id
      }) do
    frontend_limit = ApplicableSettings.max_frontend_limit(conn.assigns.current_user)

    conn
    |> json(
      Explorations.get_dependency(
        column_id,
        foreign_column_id,
        table_id,
        value,
        value_column_id,
        frontend_limit,
        %{
          current_user: conn.assigns.current_user,
          explore_dependencies_view_column_id: column_id,
          explore_dependencies_view_foreign_column_id: foreign_column_id,
          explore_dependencies_view_table_id: table_id,
          explore_dependencies_view_value: value,
          explore_dependencies_view_value_column_id: value_column_id,
        }
      )
    )
  end

  def create_dashboard(conn, %{"column_id" => column_id, "value" => value}) do
    owner_id = conn.assigns.current_user.id

    dashboard =
      Dashboards.create_dashboard_from_exploration(column_id, value, owner_id)
      |> Repo.preload(:questions)
      |> Repo.preload(:tags)
      |> Repo.preload(:variables)
      |> Repo.preload(:notes)

    json(
      conn,
      DashboardView
      |> JaSerializer.format(dashboard, conn, type: 'dashboard')
    )
  end
end
