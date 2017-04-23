defmodule AfterGlow.DashboardView do
  import AfterGlow.Policy.Helpers
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes [:title, :description, :settings, :update_interval, :last_updated, :inserted_at, :updated_at, :question_count, :shared_to, :has_permission]
  has_many :questions,
    field: :questions,
    type: "questions",
    include: false

  has_many :tags,
    field: :tags,
    type: "tags",
    include: false

  has_many :variables,
    field: :variables,
    type: "variables",
    include: false
  
  has_one :owner,
    field: :owner_id,
    type: "users"
  
  def settings(dashboard, _conn) do
    dashboard.settings || %{gridSettings: %{}}
  end

  def shared_to(dashboard, _conn) do
    dashboard.shared_to || []
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

  def has_permission(dashboard, conn) do
    if (
      is_admin?(conn.assigns.current_user) ||
      conn.assigns.current_user.id == dashboard.owner_id ||
        shared_to(dashboard, conn) |> Enum.member?( conn.assigns.current_user.email )
    ), do: true, else: false
  end
end
