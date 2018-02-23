defmodule AfterGlow.Column do
  use AfterGlow.Web, :model

  schema "columns" do
    field :name, :string
    field :data_type, :string
    field :description
    belongs_to :table, AfterGlow.Table
    has_many :column_values, AfterGlow.ColumnValue

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :data_type, :table_id, :description])
    |> validate_required([:name, :data_type, :table_id])
  end

  def default_preloads do
    [:column_values]
  end

  def cache_deletable_associations do
    [:table]
  end

  def update_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:description])
  end
end
