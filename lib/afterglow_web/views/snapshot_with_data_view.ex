defmodule AfterGlow.SnapshotWithDataView do
  use AfterGlow.Web, :view
  use JaSerializer, dsl: true
  alias AfterGlow.SnapshotDataView

  attributes([:name, :description, :columns,  :starting_at,
  :should_save_data_to_db,
  :should_create_csv,
  :should_send_mail_on_completion, :inserted_at, :scheduled, :interval, :mail_to, :updated_at, :question_id])

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
