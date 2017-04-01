defmodule SimpleBase.ColumnValueView do
  use SimpleBase.Web, :view
  use JaSerializer.PhoenixView

  attributes [:name, :value, :inserted_at, :updated_at]
  
  has_one :column,
    field: :column_id,
    type: "column"

end
