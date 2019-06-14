defmodule AfterGlow.SettingController do
  use AfterGlow.Web, :controller
  @model_type "settings"
  @model AfterGlow.Settings.GlobalSetting
  @query_functions AfterGlow.Settings.GlobalSettingsQueryFunctions

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)
  # plug(:authorize!, Team)
  # plug(:verify_authorized)

  action_fallback(AfterGlow.Web.FallbackController)
  use AfterGlow.Utils.Controllers.Crud
end
