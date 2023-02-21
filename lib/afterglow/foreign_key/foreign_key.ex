defmodule AfterGlow.ForeignKey do
  use Ecto.Schema
  import EctoEnum, only: [defenum: 2]
  import Ecto.Changeset
  alias AfterGlow.ForeignKey
  alias AfterGlow.Column
  defenum(FkTypeEnum, fk: 0, guess: 1, user_defined: 2)

  @derive {Jason.Encoder,
           only: [
             :id,
             :name,
             :fk_type
           ]}
  schema "foreign_keys" do
    field(:name, :string)
    field(:fk_type, FkTypeEnum)
    belongs_to(:column, Column)
    belongs_to(:foreign_column, Column)
    timestamps()
  end

  @doc false
  def changeset(%ForeignKey{} = foreign_key, attrs) do
    foreign_key
    |> cast(attrs, [:name, :fk_type, :column_id, :foreign_column_id])
    |> validate_required([:name, :fk_type, :column_id, :foreign_column_id])
    |> unique_constraint(:column_id, name: :fk_column_id_foreign_column_id_index)
  end
end
