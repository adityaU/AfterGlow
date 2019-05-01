defmodule AfterGlow.AlertNotificationSettingController do
  use AfterGlow.Web, :controller
  @model_type "alert_notification_settings"
  @model AfterGlow.Alerts.AlertNotificationSetting
  @query_functions AfterGlow.Alerts.AlertNotificationSettingQueryFunctions

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)
  plug(:authorize!, Team)
  plug(:verify_authorized)

  action_fallback(AfterGlow.Web.FallbackController)
  use AfterGlow.Utils.Controllers.Crud
end
