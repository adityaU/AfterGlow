defmodule AfterGlow.TagView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes [:name, :description,:color, :inserted_at, :updated_at]
  
  has_many :questions,
    field: :questions,
    type: "questions",
    include: false

  has_many :dashboards,
    field: :dashboards,
    type: "dashboards",
    include: false

end
