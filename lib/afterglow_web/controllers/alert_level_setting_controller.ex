defmodule AfterGlow.AlertLevelSettingController do
  use AfterGlow.Web, :controller
  @model_type "alert_level_settings"
  @model AfterGlow.Alerts.AlertLevelSetting
  @query_functions AfterGlow.Alerts.AlertLevelSettingQueryFunctions

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)
  plug(:authorize!, Team)
  plug(:verify_authorized)

  action_fallback(AfterGlow.Web.FallbackController)
  use AfterGlow.Utils.Controllers.Crud
end
