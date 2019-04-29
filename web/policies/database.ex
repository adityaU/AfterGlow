defmodule AfterGlow.Database.Policy do
  import AfterGlow.Policy.Helpers
  import Ecto.Query
  def can?(nil, _action, _database), do: false
  def can?(user, :index, _database), do: has_permission(user, ["Settings.all", "Question.show"])
  def can?(user, :sync, _database), do: has_permission(user, ["Settings.all", "Question.create"])
  def can?(user, :show, _database), do: has_permission(user, ["Settings.all", "Question.show"])
  def can?(user, :update, _database), do: has_permission(user, "Settings.all")
  def can?(user, :delete, _database), do: has_permission(user, "Settings.all")
  def can?(user, :create, _database), do: has_permission(user, "Settings.all")
  def can?(_, _, _), do: false

  def scope(user, _action, scope) do
    if has_permission(user, "Settings.all") do
      scope
    else
      from(
        s in scope,
        join: td in assoc(s, :team_databases),
        join: t in assoc(td, :team),
        join: ut in assoc(t, :user_teams),
        join: u in assoc(ut, :user),
        where: u.id == ^user.id,
        group_by: s.id
      )
    end
  end
end
