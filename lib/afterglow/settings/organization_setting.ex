defmodule AfterGlow.Settings.OrganizationSetting do
  use AfterGlow.Web, :model
  alias AfterGlow.Organizations.Organization
  alias AfterGlow.ApiActions.ApiAction
  import EctoEnum, only: [defenum: 2]

  defenum(SettingTypeEnum, general: 1, variable: 2)

  @cast_params [:name, :value, :setting_type, :organization_id, :api_action_id]
  @required_params @cast_params -- [:value, :api_action_id]

  schema "organization_settings" do
    field(:name, :string)
    field(:value, :string)
    field(:setting_type, SettingTypeEnum)

    belongs_to(:organization, Organization, foreign_key: :organization_id)
    belongs_to(:api_action, ApiAction)
    timestamps()
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @cast_params)
    |> validate_required(@required_params)
  end
end
