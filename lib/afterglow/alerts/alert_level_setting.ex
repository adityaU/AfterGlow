defmodule AfterGlow.Alerts.AlertLevelSetting do
  use Ecto.Schema
  alias Ecto.Changeset
  alias AfterGlow.Alerts.AlertSetting
  import EctoEnum

  @cast_params [:level, :value, :alert_setting_id]

  @required_params @cast_params

  defenum(LevelEnum,
    warning: 1,
    critical: 2
  )

  schema("alert_level_settings") do
    field(:level, LevelEnum)
    field(:value, :string)
    belongs_to(:alert_setting, AlertSetting)
    timestamps()
  end

  def changeset(%__MODULE__{} = struct, attrs) do
    struct
    |> Changeset.cast(attrs, @cast_params)
    |> Changeset.validate_required(@required_params)
  end
end
