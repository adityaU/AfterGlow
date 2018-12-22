defmodule AfterGlow.Snapshots.Snapshot do
  use Ecto.Schema
  import Ecto.Changeset
  alias AfterGlow.Snapshots.Snapshot
  alias AfterGlow.Snapshots.SnapshotData
  alias AfterGlow.Question
  import EctoEnum, only: [defenum: 2]

  defenum(StatusEnum, pending: 0, in_process: 1, success: 2, failed: 3)

  schema "snapshots" do
    field(:columns, {:array, :string})
    field(:name, :string)
    field(:description, :string)
    field(:scheduled, :boolean)
    field(:interval, :integer)
    field(:starting_at, Ecto.DateTime)
    field(:status, StatusEnum)
    field(:should_save_data_to_db, :boolean)
    field(:should_create_csv, :boolean)
    field(:should_send_mail_on_completion, :boolean)
    field(:mail_to, {:array, :string})
    field(:searchable_columns, {:array, :string})
    field(:keep_latest, :integer)
    belongs_to(:question, Question)
    belongs_to(:parent, Snapshot, foreign_key: :parent_id)
    has_many(:children, Snapshot, foreign_key: :parent_id,  on_delete: :delete_all, on_replace: :delete)
    has_many(:snapshot_data, SnapshotData,  on_delete: :delete_all, on_replace: :delete)

    timestamps()
  end

  def cache_deletable_associations do
    [:question]
  end

  @doc false
  def changeset(%Snapshot{} = snapshot, attrs) do
    snapshot
    |> cast(attrs, [
      :name,
      :columns,
      :question_id,
      :description,
      :scheduled,
      :interval,
      :starting_at,
      :status,
      :should_save_data_to_db,
      :should_create_csv,
      :should_send_mail_on_completion,
      :mail_to,
      :searchable_columns,
      :keep_latest,
      :parent_id
    ])
    |> validate_required([:name, :question_id])
  end
end
