defmodule AfterGlow.AlertSettingController do
  use AfterGlow.Web, :controller
  @model_type "alert-settings"
  @model AfterGlow.Alerts.AlertSetting
  @query_functions AfterGlow.Alerts.AlertSettingQueryFunctions

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)
  # plug(:authorize!, Team)
  # plug(:verify_authorized)

  action_fallback(AfterGlow.Web.FallbackController)
  use AfterGlow.Utils.Controllers.Crud
end
