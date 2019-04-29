defmodule AfterGlow.TeamStrippedView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  def type do
    "team"
  end

  attributes([
    :name,
    :description,
    :inserted_at,
    :updated_at
  ])
end
