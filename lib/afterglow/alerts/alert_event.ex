defmodule AfterGlow.Alerts.AlertEvent do
  use Ecto.Schema
  alias Ecto.Changeset
  alias AfterGlow.Alerts.AlertSetting
  import EctoEnum
  alias AfterGlow.Alerts.AlertSetting
  alias AfterGlow.Alerts.AlertLevelSetting

  @cast_params [
    :alert_level_setting_id,
    :alert_setting_id,
    :alert_level,
    :row_numbers,
    :data,
    :is_data_saved
  ]

  @required_params @cast_params

  defenum(LevelEnum,
    warning: 1,
    critical: 2,
    ok: 3
  )

  schema("alert_level_settings") do
    belongs_to(:alert_level_setting, AlertLevelSetting)
    belongs_to(:alert_setting, AlertSetting)
    field(:alert_level, :integer)
    field(:row_numbers, {:array, :integer})
    field(:data, :map)
    field(:is_data_saved, :boolean, default: true)
    timestamps()
  end

  def changeset(%__MODULE__{} = struct, attrs) do
    struct
    |> Changeset.cast(attrs, @cast_params)
    |> Changeset.validate_required(@required_params)
  end
end
