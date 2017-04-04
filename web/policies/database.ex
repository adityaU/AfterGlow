defmodule AfterGlow.Database.Policy do
  import AfterGlow.Policy.Helpers
  def can?(nil, _action, _database), do: false
  def can?(user, :index, _database), do: has_permission(user, ["Settings.all", "Question.show"])
  def can?(user, :show, _database), do: has_permission(user, "Settings.all")
  def can?(user, :update, _database), do: has_permission(user, "Settings.all")
  def can?(user, :delete, _database), do: has_permission(user, "Settings.all")
  def can?(user, :create, _database), do: has_permission(user, "Settings.all")
  def can?(_, _, _), do: false

end
