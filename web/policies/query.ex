defmodule AfterGlow.Query.Policy do
  import AfterGlow.Policy.Helpers
  def can?(nil, _action, _query), do: false
  def can?(user, :execute, _query), do: has_permission(user, "Question.create")
  def can?(user, :completed_query, _query), do: true
  def can?(_, _, _), do: false

end
