defmodule AfterGlow.Alerts.AlertNotificationSetting do
  use Ecto.Schema
  alias Ecto.Changeset
  alias AfterGlow.Alerts.AlertSetting
  import EctoEnum

  @cast_params [:method, :recipients, :alert_settings_id]

  @required_params @cast_params

  defenum(LevelEnum,
    warning: 1,
    critical: 2
  )

  schema("alert_level_settings") do
    field(:method, :integer)
    field(:recipients, {:array, :string})
    belongs_to(:alert_setting_id, AlertSetting)
    timestamps()
  end

  def changeset(%__MODULE__{} = struct, attrs) do
    struct
    |> Changeset.cast(attrs, @cast_params)
    |> Changeset.validate_required(@required_params)
  end
end
