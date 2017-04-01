defmodule SimpleBase.PermissionSet.Policy do
  import SimpleBase.Policy.Helpers
  def can?(nil, _action, _permission_set), do: false
  def can?(user, :index, _permission_set), do: has_permission(user, "Settings.all")
  def can?(user, :show, _permission_set), do: has_permission(user, "Settings.all")
  def can?(user, :update, _permission_set), do: has_permission(user, "Settings.all")
  def can?(user, :delete, _permission_set), do: has_permission(user, "Settings.all")
  def can?(user, :create, _permission_set), do: has_permission(user, "Settings.all")
  def can?(_, _, _), do: false

end
