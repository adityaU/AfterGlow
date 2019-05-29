defmodule AfterGlow.Alerts.AlertEventsTransformedData do
  use Ecto.Schema
  alias Ecto.Changeset
  alias AfterGlow.Alerts.AlertEvent
  import EctoEnum

  @cast_params [
    :alert_event_id,
    :level,
    :value
  ]

  @required_params @cast_params

  defenum(LevelEnum,
    warning: 1,
    critical: 2,
    ok: 3
  )

  schema("alert_event_transformed_data") do
    belongs_to(:alert_event, AlertEvent)
    field(:level, LevelEnum)
    field(:value, :string)
    timestamps()
  end

  def changeset(%__MODULE__{} = struct, attrs) do
    struct
    |> Changeset.cast(attrs, @cast_params)
    |> Changeset.validate_required(@required_params)
  end
end
