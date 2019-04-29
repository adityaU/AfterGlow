defmodule AfterGlow.DatabaseStrippedView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes([:name, :db_type, :unique_identifier, :inserted_at, :updated_at, :last_accessed_at])

  def type do
    "database"
  end
end
