defmodule AfterGlow.Column do
  use AfterGlow.Web, :model

  schema "columns" do
    field :name, :string
    field :data_type, :string
    belongs_to :table, AfterGlow.Table
    has_many :column_values, AfterGlow.ColumnValue

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :data_type, :table_id])
    |> validate_required([:name, :data_type, :table_id])
  end
end
