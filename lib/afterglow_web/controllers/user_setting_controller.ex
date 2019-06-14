defmodule AfterGlow.UserSettingController do
  use AfterGlow.Web, :controller
  @model_type "user-settings"
  @model AfterGlow.Settings.UserSetting
  @query_functions AfterGlow.Settings.UserSettingsQueryFunctions

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)
  # plug(:authorize!, Team)
  # plug(:verify_authorized)

  action_fallback(AfterGlow.Web.FallbackController)
  use AfterGlow.Utils.Controllers.Crud
end
