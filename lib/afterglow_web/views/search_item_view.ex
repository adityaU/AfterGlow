defmodule AfterGlow.SearchItemView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  def type do
    "search-items"
  end

  attributes([
    :title,
    :item_type,
    :type_id
  ])
end
