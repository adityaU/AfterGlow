defmodule AfterGlow.QuestionSearchView do
  use AfterGlow.Web, :view
  import AfterGlow.Policy.Helpers
  use JaSerializer, dsl: true

  attributes [
    :id,
    :title,
    :last_updated_at,
    :sql,
    :human_sql,
    :results_view_settings,
    :inserted_at,
    :updated_at,
    :shared_to,
    :has_permission
  ]

  def type do
    "question"
  end

  has_many :dashboards,
    field: :dashboards,
    type: "dashboards",
    include: false
  
  has_many :tags,
    field: :tags,
    type: "tags",
    include: false
  
  has_many :variables,
    field: :variables,
    type: "variables",
    include: false

  has_many :snapshots,
    field: :snapshots,
    type: "snapshots",
    include: false
  
  has_one :owner,
    field: :owner_id,
    type: "users"

  def shared_to(question, _conn) do
    question.shared_to || []
  end
  
  def has_permission(question, conn) do
    if (
      is_admin?(conn.assigns.current_user) ||
        conn.assigns.current_user.id == question.owner_id ||
        shared_to(question, conn) |> Enum.member?( conn.assigns.current_user.email )
    ), do: true, else: false
  end
end
