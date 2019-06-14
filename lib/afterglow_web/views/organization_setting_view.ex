defmodule AfterGlow.OrganizationSettingView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  def type do
    "organization-settings"
  end

  attributes([
    :name,
    :value,
    :setting_type,
    :organization_id,
    :api_action_id
  ])
end
