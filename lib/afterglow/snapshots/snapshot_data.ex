defmodule AfterGlow.Snapshots.SnapshotData do
  use Ecto.Schema
  import Ecto.Changeset
  alias AfterGlow.Snapshots.SnapshotData

  schema "snapshot_data" do
    field(:row, :map)
    field(:snapshot_id, :id)
    field(:identifier, Ecto.UUID)

    timestamps()
  end

  @doc false
  def changeset(%SnapshotData{} = snapshot_data, attrs) do
    snapshot_data
    |> cast(attrs, [:row, :snapshot_id])
    |> validate_required([:row, :snapshot_id])
  end
end
