defmodule AfterGlow.UserView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes([
    :first_name,
    :last_name,
    :full_name,
    :email,
    :metadata,
    :profile_pic,
    :is_deactivated
  ])

  has_many(
    :permission_sets,
    field: :permission_sets,
    type: "permission_set"
  )
end
