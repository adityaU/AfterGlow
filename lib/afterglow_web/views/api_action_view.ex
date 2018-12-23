defmodule AfterGlow.ApiActionView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes([
    :name,
    :color,
    :method,
    :url,
    :headers,
    :body,
    :question_id,
    :response_settings,
    :inserted_at,
    :updated_at
  ])

  def type do
    "api-actions"
  end
end
