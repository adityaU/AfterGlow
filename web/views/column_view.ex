defmodule AfterGlow.ColumnView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  alias Phoenix.Naming  
  attributes [:name, :data_type, :inserted_at, :updated_at, :human_name]
  
  has_one :table,
    field: :table_id,
    type: "table"


  has_many :column_values,
    field: :column_values,
    type: "column_value"

  def human_name(table, _conn) do
    table.name |> Naming.humanize 
  end
end
