defmodule AfterGlow.Permission.Policy do
  import AfterGlow.Policy.Helpers
  def can?(nil, _action, _permission), do: false
  def can?(user, :index, _permission), do: has_permission(user, "Settings.all")
  def can?(user, :show, _permission), do: has_permission(user, "Settings.all")
  def can?(user, :update, _permission), do: has_permission(user, "Settings.all")
  def can?(user, :delete, _permission), do: has_permission(user, "Settings.all")
  def can?(user, :create, _permission), do: has_permission(user, "Settings.all")
  def can?(_, _, _), do: false

end
