defmodule AfterGlow.Settings.GlobalSettingsQueryFunctions do
  @model AfterGlow.Settings.GlobalSetting
  @default_preloads []
  use AfterGlow.Utils.Models.Crud

  @settings [
    ["SENDER_EMAIL_ID", nil],
    ["EMAIL_SERVER_HOSTNAME", nil],
    ["EMAIL_SERVER", nil],
    ["EMAIL_PORT", nil],
    ["EMAIL_USERNAME", nil],
    ["EMAIL_PASSWORD", nil],
    ["AWS_ACCESS_KEY_ID", nil],
    ["AWS_SECRET_ACCESS_KEY", nil],
    ["S3_BUCKET", nil],
    ["AWS_REGION", nil],
    ["MAX_DOWNLOAD_LIMIT", nil],
    ["DOWNLOAD_ALLOWED", "true"],
    ["USE_SIGNED_S3_URLS_IN_MAILS", "false"],
    # in seconds
    ["S3_SIGNED_URL_TIMEOUT", "600"],
    ["MAX_FRONTEND_LIMIT", "2000"],
    ["OPENAI_API_KEY", ""],
    ["OPENAI_ENABLED", "true"],
    ["USERS_CAN_OVERRIDE_OPENAI_KEY", "true"],
    ["OPENAI_MODEL_NAME", "text-davinci-003"],
    ["THEME_PRIMARY_COLOR", "rgb(85 64 198)"],
    ["THEME_SECONDARY_COLOR", "rgb(245 247 251)"],
    ["THEME_TERTIARY_COLOR", "rgb(255 255 255)"],
    ["THEME_DEFAULT_COLOR", "rgb(32 33 36)"],
    ["THEME_WHITE_COLOR", "rgb(255 255 255)"]
  ]

  def create_or_update_settings() do
    @settings
    |> Enum.each(fn [setting_name, value] ->
      verify_setting(setting_name, value)
    end)
  end

  defp verify_setting(setting_name, value) do
    create_setting(
      setting_name,
      value,
      from(us in @model,
        where: us.name == ^setting_name
      )
      |> Repo.all()
      |> length == 0
    )
  end

  defp create_setting(_setting_name, _value, false), do: true

  defp create_setting(setting_name, value, true) do
    _create(%{name: setting_name, value: value})
  end

  def find_by_name(name) do
    from(gs in @model, where: gs.name == ^name, order_by: [desc: :updated_at], limit: 1)
    |> Repo.one()
    |> fetch_value()
  end

  defp fetch_value(nil), do: nil

  defp fetch_value(setting) do
    setting.value
  end
end
