defmodule AfterGlow.ScheduleController do
  use AfterGlow.Web, :controller

  alias AfterGlow.Scheduler.QueryFunctions, as: Schedule

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)

  def show(conn, %{"id" => dashbaord_id}) do
    conn |> json(%{schedule: Schedule.get_by_dashboard_id(dashbaord_id)})
  end

  def save_for_dashbaord(conn, params) do
    conn
    |> json(%{schedule: Schedule.save_for_dashbaord(params["id"], params |> Map.delete("id"))})
  end
end
