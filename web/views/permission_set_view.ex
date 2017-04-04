defmodule AfterGlow.PermissionSetView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes [:name, :inserted_at, :updated_at]
  
  has_many :permissions,
    field: :permissions,
    type: "permission"

end
