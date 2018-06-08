defmodule AfterGlow.WidgetView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView
  alias AfterGlow.WidgetItemView

  attributes([
    :name,
    :column_name,
    :inserted_at,
    :updated_at,
    :renderer
  ])

  has_many(
    :widget_items,
    field: :widget_items,
    type: "widget-items",
    serializer: WidgetItemView,
    include: true
  )
end
