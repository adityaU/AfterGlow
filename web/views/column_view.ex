defmodule SimpleBase.ColumnView do
  use SimpleBase.Web, :view
  use JaSerializer.PhoenixView

  alias Phoenix.Naming  
  attributes [:name, :data_type, :inserted_at, :updated_at, :human_name]
  
  has_one :table,
    field: :table_id,
    type: "table"

  def human_name(table, _conn) do
    table.name |> Naming.humanize 
  end
end
