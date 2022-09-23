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
    :visualization_id,
    :open_in_new_tab,
    :response_settings,
    :loading_message,
    :inserted_at,
    :updated_at,
    :column,
    :top_level_question_id
  ])

  def type do
    "api-actions"
  end

  def top_level_question_id(api_action, _conn) do
    if api_action.action_level == :question do
      api_action.question_id
    end
  end

  def question_id(api_action, _conn) do
    if api_action.action_level == :question_response do
      api_action.question_id
    end
  end
end
