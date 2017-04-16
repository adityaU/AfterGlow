defmodule AfterGlow.VariableDashboardView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes [:inserted_at, :updated_at]
  
  has_one :dashboard,
    field: :dashboard_id,
    type: "dashboard"
  has_one :variable,
    field: :variable_id,
    type: "variable"

end
