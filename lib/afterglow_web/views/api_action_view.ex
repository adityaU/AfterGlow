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
    :open_in_new_tab,
    :response_settings,
    :inserted_at,
    :updated_at,
    :column
  ])

  def type do
    "api-actions"
  end
end
