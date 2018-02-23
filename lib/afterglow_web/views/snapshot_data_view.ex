defmodule AfterGlow.SnapshotDataView do
  use AfterGlow.Web, :view
  use JaSerializer, dsl: true


  attributes [:row, :inserted_at, :updated_at, :snapshot_id]
  
end
