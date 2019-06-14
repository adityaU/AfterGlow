defmodule AfterGlow.UserView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView
  alias AfterGlow.TeamStrippedView

  attributes([
    :first_name,
    :last_name,
    :full_name,
    :email,
    :metadata,
    :profile_pic,
    :is_deactivated,
    :organization_id
  ])

  has_many(
    :permission_sets,
    field: :permission_sets,
    type: "permission_set"
  )

  has_many(
    :teams,
    field: :teams,
    type: "team",
    serializer: TeamStrippedView
  )

  has_one(
    :organization,
    field: :organization_id,
    type: "organizations"
  )
end
