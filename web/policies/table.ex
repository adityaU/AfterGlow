defmodule SimpleBase.Table.Policy do
  import SimpleBase.Policy.Helpers
  def can?(nil, _action, _table), do: false
  def can?(user, :index, _table), do: has_permission(user, "Question.show")
  def can?(user, :show, _table), do: has_permission(user, "Question.show")
  def can?(user, :update, _table), do: has_permission(user, "Question.edit")
  def can?(user, :delete, _table), do: has_permission(user, "Question.delete")
  def can?(user, :create, _table), do: has_permission(user, "Question.create")
  def can?(_, _, _), do: false
end
