defmodule AfterGlow.QuestionView do
  import AfterGlow.Policy.Helpers
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes([
    :title,
    :last_updated,
    :sql,
    :human_sql,
    :cached_results,
    :results_view_settings,
    :inserted_at,
    :updated_at,
    :shareable_link,
    :is_shareable_link_public,
    :query_type,
    :columns,
    :shared_to,
    :config,
    :api_action,
    :has_permission
  ])

  has_many(
    :dashboards,
    field: :dashboards,
    type: "dashboards",
    include: false
  )

  has_many(
    :api_actions,
    field: :api_actions,
    type: "api-actions",
    include: false
  )

  has_many(
    :tags,
    field: :tags,
    type: "tags",
    include: false
  )

  has_many(
    :variables,
    field: :variables,
    type: "variables",
    include: false
  )

  # has_one(
  #   :api_action,
  #   field: :api_action,
  #   type: "api_actions"
  # )

  has_many(
    :snapshots,
    field: :snapshots,
    type: "snapshots",
    include: false
  )

  has_many(
    :widgets,
    field: :widgets,
    type: "widgets",
    include: false
  )

  has_one(
    :owner,
    field: :owner_id,
    type: "users"
  )

  def shared_to(question, _conn) do
    question.shared_to || []
  end

  def api_action(question, _conn) do
    question.api_action
  end

  def has_permission(question, conn) do
    if is_admin?(conn.assigns.current_user) || conn.assigns.current_user.id == question.owner_id ||
         shared_to(question, conn) |> Enum.member?(conn.assigns.current_user.email),
       do: true,
       else: false
  end
end
