require IEx
defmodule AfterGlow.DashboardView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes [:title, :description, :settings, :update_interval, :last_updated, :inserted_at, :updated_at, :question_count]
  
  has_many :questions,
    field: :questions,
    type: "questions",
    include: false

  def settings(dashboard, _conn) do
    dashboard.settings || %{gridSettings: %{}}
  end

  def question_count(dashboard, _conn) do
    count = dashboard.questions |> length
    case count do
      0 ->
        "0 questions"
      1 ->
        "1 question"
      _ ->
        "#{count} question"
    end
  end
end
