defmodule AfterGlow.NoteView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes([
    :content,
    :inserted_at,
    :updated_at
  ])

  has_one(
    :dashboard,
    field: :dashboard_id,
    type: "dashboards"
  )
end
