defmodule AfterGlow.Database.QueryFunctions do
  alias AfterGlow.Database.Policy, as: DatabasePolicy

  @model AfterGlow.Database
  @default_preloads []

  use AfterGlow.Utils.Models.Crud
  alias AfterGlow.Repo
  import Ecto.Query, only: [from: 2]

  def has_access(database_id, current_user) do
    DatabasePolicy.scope(current_user, :show, from(d in @model, where: d.id == ^database_id))
    |> Repo.all()
    |> length() >
      0
  end
end
