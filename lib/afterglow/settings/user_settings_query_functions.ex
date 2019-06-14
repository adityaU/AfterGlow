defmodule AfterGlow.Settings.UserSettingsQueryFunctions do
  @model AfterGlow.Settings.UserSetting
  @default_preloads []
  use AfterGlow.Utils.Models.Crud

  @general_settings [
    ["MAX_DOWNLOAD_LIMIT", nil],
    ["DOWNLOAD_ALLOWED", "true"]
  ]

  def list(%{"user_id" => user_id}) do
    {:ok,
     from(us in @model, where: us.user_id == ^user_id)
     |> Repo.all()}
  end

  def verify_general_settings(user_id) do
    @general_settings
    |> Enum.each(fn [setting_name, value] ->
      verify_setting(setting_name, value, user_id)
    end)
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
      |> IO.inspect(label: "setting")
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
