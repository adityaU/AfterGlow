defmodule AfterGlow.Snippets.Model do
  use Ecto.Schema
  alias Phoenix.Channel
  alias AfterGlow.Database
  alias Ecto.Changeset
  alias AfterGlow.User

  @cast_params [
    :name,
    :text,
    :expand_on_select,
    :database_id,
    :owner_id
  ]

  @required_params @cast_params
  @derive {Jason.Encoder, only: @cast_params ++ [:id]}
  schema("snippets") do
    field(:name, :string)
    field(:text, :string)
    field(:expand_on_select, :boolean)
    belongs_to(:database, Database)
    belongs_to(:owner, User, foreign_key: :owner_id)
    timestamps()
  end

  def changeset(%__MODULE__{} = struct, attrs) do
    struct
    |> Changeset.cast(attrs, @cast_params)
    |> Changeset.unique_constraint(:name, name: "snippets_name_database_id_index")
    |> Changeset.validate_required(@required_params)
  end
end
