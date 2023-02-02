defmodule AfterGlow.Scheduler.Schedule do
  use Ecto.Schema
  alias Ecto.Changeset

  @required_params [
    :every,
    :time_unit,
    :time_details,
    :job_details,
    :is_active,
    :recipients,
    :timezone
  ]
  @cast_params @required_params ++ [:is_running, :next_execution_time]

  @derive {Jason.Encoder, only: @required_params ++ [:id]}
  schema("schedules") do
    field(:every, :integer)
    field(:time_unit, :string)
    field(:time_details, {:array, :map})
    field(:next_execution_time, :utc_datetime)
    field(:is_running, :boolean)
    field(:job_details, :map)
    field(:is_active, :boolean)
    field(:recipients, {:array, :string})
    field(:timezone, :string)

    timestamps()
  end

  def changeset(%__MODULE__{} = struct, attrs) do
    struct
    |> Changeset.cast(attrs, @cast_params)
    |> Changeset.validate_required(@required_params)
  end
end
