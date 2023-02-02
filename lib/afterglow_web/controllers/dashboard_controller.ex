defmodule AfterGlow.NewDashboardController do
  use AfterGlow.Web, :controller

  alias AfterGlow.Dashboards.QueryFunctions, as: Dashboards

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)

  def possible_variables(conn, %{"id" => dashbaord_id}) do
    conn |> json(%{variables: Dashboards.possible_variables(dashbaord_id)})
  end
end
