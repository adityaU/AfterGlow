defmodule AfterGlow.TeamView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView
  alias AfterGlow.UserView
  alias AfterGlow.DatabaseView

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
    serializer: UserView,
    include: true
  )

  has_many(
    :accessible_databases,
    field: :accessible_databases,
    type: "databases",
    serializer: DatabaseView,
    include: true
  )
end
