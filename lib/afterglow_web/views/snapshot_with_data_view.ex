defmodule AfterGlow.SnapshotWithDataView do
  use AfterGlow.Web, :view
  use JaSerializer, dsl: true
  alias AfterGlow.SnapshotDataView

  attributes([:name, :description, :columns, :inserted_at, :updated_at, :question_id])

  has_many(
    :snapshot_data,
    field: :snapshot_data,
    type: "snapshot_data",
    serializer: SnapshotDataView,
    include: true
  )

  def type do
    "snapshot"
  end
end
