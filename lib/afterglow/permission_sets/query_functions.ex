defmodule AfterGlow.PermissionSets.QueryFunctions do
  @model AfterGlow.PermissionSet
  @default_preloads []
  import Ecto.Query

  use AfterGlow.Utils.Models.Crud
  alias AfterGlow.UserPermissionSet

  def add_user(user_id, permission_set_id) do
    UserPermissionSet.changeset(%UserPermissionSet{}, %{
      user_id: user_id,
      permission_set_id: permission_set_id
    })
    |> Repo.insert()

  end

end
