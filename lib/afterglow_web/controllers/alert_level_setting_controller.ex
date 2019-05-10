defmodule AfterGlow.AlertLevelSettingController do
  use AfterGlow.Web, :controller
  @model_type "alert-level-settings"
  @model AfterGlow.Alerts.AlertLevelSetting
  @query_functions AfterGlow.Alerts.AlertLevelSettingQueryFunctions

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)
  # plug(:authorize!, Team)
  # plug(:verify_authorized)

  action_fallback(AfterGlow.Web.FallbackController)
  use AfterGlow.Utils.Controllers.Crud
end
