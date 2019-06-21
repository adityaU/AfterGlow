defmodule AfterGlow.SearchTableView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView
  alias Phoenix.Naming
  alias AfterGlow.SearchColumnView

  def type do
    "search-tables"
  end

  attributes([
    :name,
    :inserted_at,
    :updated_at,
    :readable_table_name,
    :human_name,
    :open,
    :expandable
  ])

  has_many(:columns,
    field: :columns,
    type: "columns",
    serializer: SearchColumnView,
    include: true
  )

  has_one(:database,
    field: :database_id,
    type: "database"
  )

  def human_name(table, _conn) do
    table.readable_table_name |> Naming.humanize()
  end
end
