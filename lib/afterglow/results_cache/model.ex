defmodule AfterGlow.ResultsCache.Model do
  use Ecto.Schema
  alias Ecto.Changeset

  @cast_params [
    :key,
    :sql,
    :expiry_time,
    :data,
  ]

  @required_params [:key, :sql, :data, :expiry_time]

  @derive {Jason.Encoder, only: @cast_params ++ [:id]}
  schema("results_cache") do

      field(:key, :string)
      field(:sql, :string)
      field(:data, :map)
      field(:expiry_time, :utc_datetime)

      timestamps()
  end

  def changeset(%__MODULE__{} = struct, attrs) do
    struct
    |> Changeset.cast(attrs, @cast_params)
    |> Changeset.validate_required(@required_params)
  end
end


