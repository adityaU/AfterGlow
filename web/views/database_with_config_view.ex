defmodule AfterGlow.DatabaseWithConfigView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes([
    :name,
    :db_type,
    :unique_identifier,
    :inserted_at,
    :updated_at,
    :last_accessed_at,
    :config
  ])

  def type do
    "database"
  end
end
