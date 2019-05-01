defmodule AfterGlow.AlertEventController do
  use AfterGlow.Web, :controller
  @model_type "alert_events"
  @model AfterGlow.Alerts.AlertSetting
  @query_functions AfterGlow.Alerts.AlertSettingQueryFunctions

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)
  plug(:authorize!, Team)
  plug(:verify_authorized)

  action_fallback(AfterGlow.Web.FallbackController)
  use AfterGlow.Utils.Controllers.Crud

  def create(_conn, _params), do: {:error, :not_allowed}
  def update(_conn, _params), do: {:error, :not_allowed}
  def delete(_conn, _params), do: {:error, :not_allowed}
end
