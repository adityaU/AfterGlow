defmodule AfterGlow.Settings.UserSettingsQueryFunctions do
  @model AfterGlow.Settings.UserSetting
  @default_preloads []
  alias AfterGlow.Settings.ApplicableSettings
  use AfterGlow.Utils.Models.Crud

  def general_settings(org_id) do
    [
      [
        "MAX_DOWNLOAD_LIMIT",
        ApplicableSettings.organization_setting_by_name("MAX_DOWNLOAD_LIMIT", org_id) ||
          ApplicableSettings.global_setting_by_name("MAX_DOWNLOAD_LIMIT")
      ],
      [
        "DOWNLOAD_ALLOWED",
        ApplicableSettings.organization_setting_by_name("DOWNLOAD_ALLOWED", org_id) ||
          ApplicableSettings.global_setting_by_name("DOWNLOAD_ALLOWED")
      ],
      [
        "OPENAI_API_KEY",
        ApplicableSettings.organization_setting_by_name("OPENAI_API_KEY", org_id) ||
          ApplicableSettings.global_setting_by_name("OPENAI_API_KEY")
      ]
    ]
  end

  def list(%{"user_id" => user_id}) do
    {:ok,
     from(us in @model, where: us.user_id == ^user_id)
     |> Repo.all()}
  end

  def verify_general_settings(user) do
    general_settings(user.organization_id)
    |> Enum.each(fn [setting_name, value] ->
      verify_setting(setting_name, value, user.id)
    end)
  end

  def create_default_settings(user_id) do
    create_setting("MAX_DOWNLOAD_LIMIT", nil, user_id, true)
    create_setting("DOWNLOAD_ALLOWED", "true", user_id, true)
    create_setting("OPENAI_API_KEY", "", user_id, true)
  end

  defp verify_setting(setting_name, value, user_id) do
    create_setting(
      setting_name,
      value,
      user_id,
      from(us in @model,
        where:
          us.name == ^setting_name and us.setting_type == "general" and us.user_id == ^user_id
      )
      |> Repo.all()
      |> length == 0
    )
  end

  defp create_setting(_setting_name, _value, _user_id, false), do: true

  defp create_setting(setting_name, value, user_id, true) do
    _create(%{name: setting_name, value: value, setting_type: "general", user_id: user_id})
  end

  def find_by_name(name, user_id) do
    from(us in @model,
      where: us.user_id == ^user_id and us.name == ^name and us.setting_type == "general",
      order_by: [desc: :updated_at],
      limit: 1
    )
    |> Repo.one()
    |> fetch_value()
  end

  defp fetch_value(nil), do: nil

  defp fetch_value(setting) do
    setting.value
  end
end
