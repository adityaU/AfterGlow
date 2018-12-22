defmodule AfterGlow.SnapshotView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes([
    :name,
    :description,
    :should_save_data_to_db,
    :scheduled,
    :interval,
    :inserted_at,
    :mail_to,
    :starting_at,
    :should_save_data_to_db,
    :should_create_csv,
    :should_send_mail_on_completion,
    :updated_at,
    :searchable_columns,
    :question_id
  ])
end
