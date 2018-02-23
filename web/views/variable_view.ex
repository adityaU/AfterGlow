defmodule AfterGlow.VariableView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes [:name, :default, :var_type, :default_options, :inserted_at, :updated_at, :question_id, :dashboard_id, :question_filter_id]

  has_one :column,
    field: :column_id,
    type: "column"
  has_one :question_filter,
    field: :question_filter_id,
    type: "question"

end
