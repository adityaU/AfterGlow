defmodule AfterGlow.Database.QueryFunctions do
  alias AfterGlow.Database.Policy, as: DatabasePolicy
  alias AfterGlow.Database
  alias AfterGlow.Repo
  import Ecto.Query, only: [from: 2]

  def has_access(database_id, current_user) do
    DatabasePolicy.scope(current_user, :show, from(d in Database, where: d.id == ^database_id))
    |> Repo.all()
    |> length() >
      0
  end
end
