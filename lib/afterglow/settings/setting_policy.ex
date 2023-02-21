defmodule AfterGlow.Settings.Setting.Policy do
  import AfterGlow.Policy.Helpers
  def can?(user, _action, _column), do: has_permission(user, "Settings.all")
end
