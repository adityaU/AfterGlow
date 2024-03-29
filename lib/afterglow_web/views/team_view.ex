defmodule AfterGlow.TeamView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView
  alias AfterGlow.UserStrippedView
  alias AfterGlow.DatabaseStrippedView

  attributes([
    :name,
    :description,
    :inserted_at,
    :updated_at
  ])

  has_many(
    :users,
    field: :users,
    type: "users",
    serializer: UserStrippedView,
    include: true
  )

  has_many(
    :accessible_databases,
    field: :accessible_databases,
    type: "databases",
    serializer: DatabaseStrippedView,
    include: true
  )
end
