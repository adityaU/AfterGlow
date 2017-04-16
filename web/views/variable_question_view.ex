defmodule AfterGlow.VariableQuestionView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes [:inserted_at, :updated_at]
  
  has_one :question,
    field: :question_id,
    type: "question"
  has_one :variable,
    field: :variable_id,
    type: "variable"

end
