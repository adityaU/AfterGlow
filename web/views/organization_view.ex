defmodule AfterGlow.OrganizationView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes([:name, :google_domain, :is_deactivated, :inserted_at, :updated_at])

  has_many(:users,
    field: :users,
    type: "user",
    include: false
  )
end
