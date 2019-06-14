defmodule AfterGlow.Settings.OrganizationSettingsQueryFunctions do
  @model AfterGlow.Settings.OrganizationSetting
  @default_preloads []
  use AfterGlow.Utils.Models.Crud

  @general_settings [
    ["MAX_DOWNLOAD_LIMIT", nil],
    ["MAX_FRONTEND_LIMIT", "2000"],
    ["DOWNLOAD_ALLOWED", "true"]
  ]

  def verify_general_settings(organization_id) do
    @general_settings
    |> Enum.each(fn [setting_name, value] ->
      verify_setting(setting_name, value, organization_id)
    end)
  end

  defp verify_setting(setting_name, value, organization_id) do
    create_setting(
      setting_name,
      value,
      organization_id,
      from(os in @model,
        where:
          os.name == ^setting_name and os.setting_type == "general" and
            os.organization_id == ^organization_id
      )
      |> Repo.all()
      |> length == 0
    )
  end

  defp create_setting(_setting_name, _value, _organization_id, false), do: true

  defp create_setting(setting_name, value, organization_id, true) do
    _create(%{
      name: setting_name,
      value: value,
      setting_type: "general",
      organization_id: organization_id
    })
  end

  def list(%{"organization_id" => org_id}) do
    {:ok,
     from(os in @model, where: os.organization_id == ^org_id)
     |> Repo.all()}
  end

  def find_by_name(name, org_id) do
    from(os in @model,
      where: os.organization_id == ^org_id and os.name == ^name and os.setting_type == "general",
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
