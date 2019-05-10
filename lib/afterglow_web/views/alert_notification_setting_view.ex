defmodule AfterGlow.AlertNotificationSettingView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes([
    :method,
    :recipients,
    :alert_setting_id,
    :inserted_at,
    :updated_at
  ])

  def type do
    "alert-notification-settings"
  end
end
