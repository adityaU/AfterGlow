defmodule AfterGlow.HTMLDashoardController do
  use AfterGlow.Web, :controller
  alias AfterGlow.Dashboards.QueryFunctions, as: Dashboards
  alias AfterGlow.Plugs.Authorization
  plug(Authorization)

  action_fallback(AfterGlow.Web.FallbackController)

  def get(conn, %{"id" => dashbaord_id}) do
    html = Dashboards.html(dashbaord_id, conn.assigns.current_user) 
    conn |> json(%{html: html})
  end
end
