defmodule AfterGlow.Question.Policy do
  alias AfterGlow.Widgets.DashboardWidget
  alias AfterGlow.Dashboard
  alias AfterGlow.Visualizations.Visualization
  import Ecto.Query
  import AfterGlow.Policy.Helpers
  def can?(nil, _action, _question), do: false
  def can?(user, :index, _question), do: has_permission(user, "Question.show")
  def can?(user, :show, _question), do: has_permission(user, "Question.show")
  def can?(user, :search, _question), do: has_permission(user, "Question.show")
  def can?(user, :results, _question), do: has_permission(user, "Question.show")
  def can?(user, :update, _question), do: has_permission(user, "Question.edit")
  def can?(user, :delete, _question), do: has_permission(user, "Question.delete")
  def can?(user, :create, _question), do: has_permission(user, "Question.create")
  def can?(user, :get_query, _question), do: has_permission(user, "Question.create")
  def can?(_, _, _), do: false

  def scope(user, _action, scope) do
    if has_permission(user, "Settings.all") do
      scope
    else
      from(
        s in scope,
        left_join: d in assoc(s, :dashboards),
        left_join: dwq in DashboardWidget,
        on: dwq.widget_id == s.id and dwq.widget_type == "question",
        left_join: ddwq in Dashboard,
        on: dwq.dashboard_id == ddwq.id,
        left_join: v in Visualization,
        on: s.id == v.question_id,
        left_join: dwv in DashboardWidget,
        on: dwv.widget_id == v.id and dwv.widget_type == "visualization",
        left_join: ddwv in Dashboard,
        on: dwv.dashboard_id == ddwv.id,
        left_join: dwvd in DashboardWidget,
        on:
          (dwvd.widget_id == ddwv.id or dwvd.widget_id == ddwq.id) and dwvd.widget_type == "tabs",
        left_join: ddd in Dashboard,
        on: dwvd.dashboard_id == ddd.id,
        where:
          s.owner_id == ^user.id or fragment("? = ANY (?)", ^user.email, s.shared_to) or
            fragment("? = ANY (?)", ^user.email, d.shared_to) or
            fragment("? = ANY (?)", "all", s.shared_to) or
            fragment("? = ANY (?)", "all", d.shared_to) or
            fragment("? = ANY (?)", ^user.email, ddwq.shared_to) or
            fragment("? = ANY (?)", "all", ddwq.shared_to) or
            fragment("? = ANY (?)", ^user.email, ddwv.shared_to) or
            fragment("? = ANY (?)", "all", ddwv.shared_to) or
            fragment("? = ANY (?)", ^user.email, ddd.shared_to) or
            fragment("? = ANY (?)", "all", ddd.shared_to),
        group_by: s.id
      )
    end
  end
end
