defmodule AfterGlow.Users.QueryFunctions do
  @model AfterGlow.User
  @default_preloads []
  import Ecto.Query

  use AfterGlow.Utils.Models.Crud

  def system_user do
    from(m in @model, where: m.email == "AG::System")
    |> Repo.one()
  end
end
