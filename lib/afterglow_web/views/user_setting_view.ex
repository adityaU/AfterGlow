defmodule AfterGlow.UserSettingView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  def type do
    "user-settings"
  end

  attributes([
    :name,
    :value,
    :setting_type,
    :user_id,
    :api_action_id
  ])
end
