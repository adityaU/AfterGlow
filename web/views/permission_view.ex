defmodule SimpleBase.PermissionView do
  use SimpleBase.Web, :view
  use JaSerializer.PhoenixView

  attributes [:name, :inserted_at, :updated_at, :permission_set_id]

  
  has_one :permission_set,
    field: :permission_set_id,
    type: "permission_set"


end
