defmodule AfterGlow.Organizations.Organization.Policy do
  import AfterGlow.Policy.Helpers
  def can?(user, _action, _column), do: has_permission(user, "Settings.all")
  def can?(_, _, _), do: false
end
