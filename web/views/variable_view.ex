defmodule AfterGlow.VariableView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes [:name, :default, :var_type, :inserted_at, :updated_at, :question_id, :dashboard_id]

  has_one :column,
    field: :column_id,
    type: "column"

end
