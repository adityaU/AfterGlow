defmodule AfterGlow.Column do
  use AfterGlow.Web, :model

  schema "columns" do
    field(:name, :string)
    field(:data_type, :string)
    field(:description)
    field(:primary_key, :boolean)
    field(:highlighted, :boolean, virtual: true)
    belongs_to(:table, AfterGlow.Table)
    has_many(:column_values, AfterGlow.ColumnValue, on_delete: :delete_all, on_replace: :delete)

    has_many(:foreign_keys, AfterGlow.ForeignKey,
      on_delete: :delete_all,
      on_replace: :delete
    )

    has_many(:belongs_to, AfterGlow.ForeignKey,
      on_delete: :delete_all,
      on_replace: :delete
    )

    has_many(:has_many, AfterGlow.ForeignKey,
      foreign_key: :foreign_column_id,
      on_delete: :delete_all,
      on_replace: :delete
    )

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :data_type, :table_id, :description, :primary_key])
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
