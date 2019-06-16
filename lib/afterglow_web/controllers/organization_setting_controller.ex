defmodule AfterGlow.OrganizationSettingController do
  use AfterGlow.Web, :controller
  @model_type "organization-settings"
  @model AfterGlow.Settings.OrganizationSetting
  @query_functions AfterGlow.Settings.OrganizationSettingsQueryFunctions

  alias AfterGlow.Settings.Setting
  alias AfterGlow.Plugs.Authorization
  plug(Authorization)

  plug(:authorize!, Setting)
  plug(:verify_authorized)
  # plug(:authorize!, Team)
  # plug(:verify_authorized)

  action_fallback(AfterGlow.Web.FallbackController)
  use AfterGlow.Utils.Controllers.Crud
end
