defmodule AfterGlow.SnapshotView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes([
    :name,
    :description,
    :should_save_data_to_db,
    :inserted_at,
    :mail_to,
    :updated_at,
    :question_id
  ])
end
