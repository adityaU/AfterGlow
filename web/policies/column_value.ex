defmodule SimpleBase.ColumnValue.Policy do
  import SimpleBase.Policy.Helpers
  def can?(nil, _action, _column_value), do: false
  def can?(user, :index, _column_value), do: has_permission(user, "Question.show")
  def can?(user, :show, _column_value), do: has_permission(user, "Question.show")
  def can?(user, :update, _column_value), do: has_permission(user, "Question.edit")
  def can?(user, :delete, _column_value), do: has_permission(user, "Question.delete")
  def can?(user, :create, _column_value), do: has_permission(user, "Question.create")
  def can?(_, _, _), do: false

end
