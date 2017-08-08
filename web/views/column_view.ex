defmodule AfterGlow.ColumnView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView
  alias AfterGlow.Helpers.String, as: HelperString

  attributes [:name, :data_type, :inserted_at, :updated_at, :human_name]
  
  has_one :table,
    field: :table_id,
    type: "table"


  has_many :column_values,
    field: :column_values,
    type: "column_value"

  def human_name(column, _conn) do
    column.name |> HelperString.titlecase 
  end
end
