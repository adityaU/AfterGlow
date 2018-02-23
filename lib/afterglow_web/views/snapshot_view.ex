defmodule AfterGlow.SnapshotView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes [:name, :description, :inserted_at, :updated_at, :question_id]

end
