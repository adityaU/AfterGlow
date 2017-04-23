defmodule AfterGlow.Dashboard.Policy do
  import Ecto.Query
  import AfterGlow.Policy.Helpers
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
      from s in scope, where: s.owner_id == ^user.id, or_where: fragment("? = ANY (?)", ^user.email , s.shared_to)
    end
  end

end
