defmodule AfterGlow.Column do
  use AfterGlow.Web, :model
  alias AfterGlow.Repo

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
  def create(column, table_id) do
    changeset = changeset(%__MODULE__{}, %{name: column |> Enum.at(0), data_type: column |> Enum.at(1), table_id: table_id })
    Repo.insert(changeset)
  end
end
