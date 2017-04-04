defmodule AfterGlow.QuestionBankView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes [:title, :inserted_at, :updated_at]
  
  has_one :questions,
    field: :questions_id,
    type: "questions"

end
