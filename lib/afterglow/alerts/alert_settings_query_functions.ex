defmodule AfterGlow.Alerts.AlertSettingQueryFunctions do
  @model AfterGlow.Alerts.AlertSetting
  @default_preloads [:alert_notification_settings, :alert_level_settings]
  use AfterGlow.Utils.Models.Crud

  def delete(:id) do
    {:error, :not_implemented}
  end

  def deactivate(id) do
    update(id, %{"is_active" => false})
  end

  def activate(id) do
    update(id, %{"is_active" => true})
  end
end
