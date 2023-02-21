defmodule AfterGlow.Tables.QueryFunctions do
  @model AfterGlow.Table
  @default_preloads []
  import Ecto.Query

  use AfterGlow.Utils.Models.Crud

  def find_by_database_id(id) do
    from(m in @model, where: m.database_id == ^id) |> Repo.all()
  end
end
