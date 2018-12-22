defmodule AfterGlow.Snapshots.SearchableColumn do
  use Ecto.Schema
  import Ecto.Changeset
  alias AfterGlow.Snapshots.Snapshot
  alias AfterGlow.Snapshots.SearchableColumn

  schema "searchable_columns" do
    field(:name, :string)
    field(:value, :string)
    belongs_to(:snapshot, Snapshot)
    field(:snapshot_data_identifier, Ecto.UUID)
    timestamps()
  end

  def changeset(%SearchableColumn{} = searchable_columns, attrs) do
    searchable_columns
    |> cast(attrs, [:name, :value, :snapshot_id, :snapshot_data_id])
    |> validate_required([:name, :snapshot_id, :snapshot_data_id])
  end
end
