defmodule AfterGlow.Snippets.Model.Policy do
  import AfterGlow.Policy.Helpers
  def can?(nil, _action, _user), do: false
  def can?(user, :index, _user), do: has_permission(user, "Question.edit")
  def can?(user, :show, _user), do: has_permission(user, "Question.edit")
  def can?(user, :find_referenced_by, _user), do: has_permission(user, "Question.edit")

  def can?(user, :create, _user),
    do: has_permission(user, "Question.edit")

  def can?(user, :update, _user),
    do: has_permission(user, "Question.edit")

  def can?(user, :delete, _user), do: has_permission(user, "Question.edit")
  def can?(_, _, _), do: false
end
