defmodule SimpleBase.PermissionSetView do
  use SimpleBase.Web, :view
  use JaSerializer.PhoenixView

  attributes [:name, :inserted_at, :updated_at]
  
  has_many :permissions,
    field: :permissions,
    type: "permission"

end
