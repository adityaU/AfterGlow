defmodule AfterGlow.WidgetItemView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes([
    :value,
    :text,
    :inserted_at,
    :updated_at,
    :config
  ])

  has_one(
    :widget,
    field: :widget_id,
    type: "widgets"
  )
end
