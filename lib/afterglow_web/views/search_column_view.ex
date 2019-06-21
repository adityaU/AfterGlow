defmodule AfterGlow.SearchColumnView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  alias Phoenix.Naming
  def type, do: "column"

  attributes([
    :name,
    :highlighted,
    :data_type,
    :description,
    :primary_key,
    :inserted_at,
    :updated_at,
    :human_name,
    :is_foreign_key
  ])

  has_one(:table,
    field: :table_id,
    type: "table"
  )

  def human_name(column, _conn) do
    column.name |> Naming.humanize()
  end

  def is_foreign_key(column, _conn) do
    column.belongs_to |> length > 0
  end
end
