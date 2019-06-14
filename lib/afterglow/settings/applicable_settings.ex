defmodule AfterGlow.Settings.ApplicableSettings do
  alias AfterGlow.Settings.GlobalSettingsQueryFunctions, as: GlobalSettings
  alias AfterGlow.Settings.UserSettingsQueryFunctions, as: UserSettings
  alias AfterGlow.Settings.OrganizationSettingsQueryFunctions, as: OrganizationSettings

  def max_frontend_limit(user) do
    get_by_applicablity_order("MAX_FRONTEND_LIMIT", user)
  end

  def max_download_limit(user) do
    get_by_applicablity_order("MAX_DOWNLOAD_LIMIT", user)
  end

  def global_max_download_limit(user) do
    global_setting_by_name("MAX_DOWNLOAD_LIMIT")
  end

  def can_download_reports(user) do
    get_by_applicablity_order_boolean("DOWNLOAD_ALLOWED", user)
  end

  def get_by_applicablity_order(name, user) do
    user_setting_by_name(name, user.id) ||
      organization_setting_by_name(name, user.organization_id) ||
      global_setting_by_name(name)
  end

  def get_by_applicablity_order_boolean(name, user) do
    [
      user_setting_by_name(name, user.id),
      organization_setting_by_name(name, user.organization_id) || "true",
      global_setting_by_name(name)
    ]
    |> Enum.all?(fn x -> x == "true" end)
  end

  def global_setting_by_name(name) do
    GlobalSettings.find_by_name(name)
  end

  def user_setting_by_name(name, user_id) do
    UserSettings.find_by_name(name, user_id)
  end

  def organization_setting_by_name(_name, nil), do: nil

  def organization_setting_by_name(name, org_id) do
    OrganizationSettings.find_by_name(name, org_id)
  end
end
