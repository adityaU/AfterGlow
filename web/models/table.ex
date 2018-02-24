defmodule AfterGlow.Table do
  use AfterGlow.Web, :model

  schema "tables" do
    field :name, :string
    field :readable_table_name, :string
    field :description
    belongs_to :database, AfterGlow.Database
    has_many :columns, AfterGlow.Column, on_delete: :delete_all, on_replace: :delete

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :readable_table_name, :database_id, :description])
    |> validate_required([:name, :readable_table_name, :database_id])
  end

  def default_preloads do
    [:database, :columns]
  end

  def cache_deletable_associations do
    default_preloads
  end

  def update_changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:description])
  end
end
