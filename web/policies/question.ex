defmodule AfterGlow.Question.Policy do
  import AfterGlow.Policy.Helpers
  def can?(nil, _action, _question), do: false
  def can?(user, :index, _question), do: has_permission(user, "Question.show")
  def can?(user, :show, _question), do: has_permission(user, "Question.show")
  def can?(user, :results, _question), do: has_permission(user, "Question.show")
  def can?(user, :update, _question), do: has_permission(user, "Question.edit")
  def can?(user, :delete, _question), do: has_permission(user, "Question.delete")
  def can?(user, :create, _question), do: has_permission(user, "Question.create")
  def can?(_, _, _), do: false

end
