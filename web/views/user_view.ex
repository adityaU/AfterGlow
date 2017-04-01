defmodule SimpleBase.UserView do
  use SimpleBase.Web, :view
  use JaSerializer.PhoenixView
  attributes [:first_name, :last_name, :full_name, :email, :metadata, :profile_pic]


  has_many :permission_sets,
    field: :permission_sets,
    type: "permission_set"
end
