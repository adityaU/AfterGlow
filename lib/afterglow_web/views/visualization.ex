defmodule AfterGlow.VisualizationView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  def type do
    "visualizations"
  end

  attributes([
    :name,
    :settings,
    :query_terms,
    :renderer_type,
    :question_id
  ])
end
