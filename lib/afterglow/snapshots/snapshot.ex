defmodule AfterGlow.Snapshots.Snapshot do
  use Ecto.Schema
  import Ecto.Changeset
  alias AfterGlow.Snapshots.Snapshot
  alias AfterGlow.Snapshots.SnapshotData
  alias AfterGlow.Question


  schema "snapshots" do
    field :columns, {:array, :string}
    field :name, :string
    field :description, :string
    belongs_to :question, Question
    has_many :snapshot_data, SnapshotData

    timestamps()
  end

  @doc false
  def changeset(%Snapshot{} = snapshot, attrs) do
    snapshot
    |> cast(attrs, [:name, :columns, :question_id, :description])
    |> validate_required([:name, :question_id])
  end
end
