defmodule AfterGlow.User.Policy do
  import AfterGlow.Policy.Helpers
  def can?(nil, _action, _user), do: false
  def can?(user, :index, _user), do: has_permission(user, "Settings.all")
  def can?(user, :show, _user), do: has_permission(user, "Settings.all")
  def can?(user, :update, _user), do: has_permission(user, "Settings.all")
  def can?(user, :delete, _user), do: has_permission(user, "Settings.all")
  def can?(user, :create, _user), do: has_permission(user, "Settings.all")
  def can?(_, _, _), do: false
end
