defmodule AfterGlow.ColumnValue do
  use AfterGlow.Web, :model

  schema "column_values" do
    field :name, :string
    field :value, :string
    belongs_to :column, AfterGlow.Column

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :value])
    |> validate_required([:name, :value])
  end
end
