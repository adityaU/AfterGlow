defmodule AfterGlow.Alerts.AlertEvent do
  use Ecto.Schema
  alias Ecto.Changeset
  alias AfterGlow.Alerts.AlertSetting
  import EctoEnum
  alias AfterGlow.Alerts.AlertSetting
  alias AfterGlow.Alerts.AlertLevelSetting

  @cast_params [
    :alert_setting_id,
    :alert_level,
    :transformed_data_column_name,
    :original_data,
    :is_data_saved
  ]

  @required_params @cast_params

  defenum(LevelEnum,
    warning: 1,
    critical: 2,
    ok: 3
  )

  schema("alert_events") do
    belongs_to(:alert_setting, AlertSetting)
    field(:alert_level, LevelEnum)
    field(:original_data, :map)
    field(:transformed_data_column_name, :string)
    field(:is_data_saved, :boolean, default: true)
    timestamps()
  end

  def changeset(%__MODULE__{} = struct, attrs) do
    struct
    |> Changeset.cast(attrs, @cast_params)
    |> Changeset.validate_required(@required_params)
  end
end
