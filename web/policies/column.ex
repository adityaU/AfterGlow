defmodule AfterGlow.Column.Policy do
  import AfterGlow.Policy.Helpers
  def can?(nil, _action, _column), do: false
  def can?(user, :index, _column), do: has_permission(user, "Question.show")
  def can?(user, :show, _column), do: has_permission(user, "Question.show")
  def can?(user, :update, _column), do: has_permission(user, "Question.edit")
  def can?(user, :delete, _column), do: has_permission(user, "Question.delete")
  def can?(user, :create, _column), do: has_permission(user, "Question.create")
  def can?(_, _, _), do: false

end
