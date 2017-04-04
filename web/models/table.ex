defmodule AfterGlow.Table do
  use AfterGlow.Web, :model

  schema "tables" do
    field :name, :string
    field :readable_table_name, :string
    belongs_to :database, AfterGlow.Database
    has_many :columns, AfterGlow.Column

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :readable_table_name, :database_id])
    |> validate_required([:name, :readable_table_name, :database_id])
  end
end
