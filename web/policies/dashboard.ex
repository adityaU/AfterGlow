defmodule AfterGlow.Dashboard.Policy do
  import Ecto.Query
  import AfterGlow.Policy.Helpers
  alias AfterGlow.Widgets.DashboardWidget
  alias AfterGlow.Dashboard
  def can?(nil, _action, _dashboard), do: false
  def can?(user, :index, _dashboard), do: has_permission(user, "Dashboard.show")
  def can?(user, :show, _dashboard), do: has_permission(user, "Dashboard.show")
  def can?(user, :update, _dashboard), do: has_permission(user, "Dashboard.edit")
  def can?(user, :delete, _dashboard), do: has_permission(user, "Dashboard.delete")
  def can?(user, :create, _dashboard), do: has_permission(user, "Dashboard.create")
  def can?(_, _, _), do: false

  def scope(user, _action, scope) do
    if has_permission(user, "Settings.all") do
      scope
    else
      from(s in scope,
        left_join: dwq in DashboardWidget,
        on: dwq.widget_id == s.id and dwq.widget_type == "tabs",
        left_join: ddwq in Dashboard,
        on: dwq.dashboard_id == ddwq.id,
        where:
          s.owner_id == ^user.id or
            fragment("? = ANY (?)", ^user.email, s.shared_to) or
            fragment("? = ANY (?)", ^user.email, ddwq.shared_to) or
            fragment("? = ANY (?)", "all", s.shared_to)
      )
    end
  end
end
