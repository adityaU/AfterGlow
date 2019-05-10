defmodule AfterGlow.AlertLevelSettingView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes([
    :level,
    :value,
    :alert_setting_id,
    :inserted_at,
    :updated_at
  ])

  def type do
    "alert-level-settings"
  end
end
