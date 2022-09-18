defmodule AfterGlow.Visualizations.Visualization do
  use Ecto.Schema
  alias Ecto.Changeset

  @cast_params [
    :settings,
    :query_terms,
    :question_id,
    :name,
    :renderer_type
  ]

  @required_params [:question_id, :name, :renderer_type]

  @derive {Jason.Encoder, only: @cast_params ++ [:id]}
  schema("visualizations") do

      field(:name, :string)
      field(:settings, :map)
      field(:query_terms, :map)
      field(:renderer_type, :string)
      field(:question_id, :integer)

      timestamps()
  end

  def changeset(%__MODULE__{} = struct, attrs) do
    struct
    |> Changeset.cast(attrs, @cast_params)
    |> Changeset.validate_required(@required_params)
  end
end


