require IEx
defmodule AfterGlow.Repo.Migrations.InitialPermissions do
  use Ecto.Migration

  def up do
    alias AfterGlow.Repo
    alias AfterGlow.PermissionSet
    alias AfterGlow.UserPermissionSet
    alias AfterGlow.Permission
    alias AfterGlow.User
    import Ecto.Query


    {:ok, admin} = Repo.insert(PermissionSet.changeset(%PermissionSet{}, %{name: "Admin"}))
    {:ok ,viewer} = Repo.insert(PermissionSet.changeset(%PermissionSet{},%{name: "Viewer"}))
    {:ok, maker} = Repo.insert(PermissionSet.changeset(%PermissionSet{},%{name: "Creator"}))

    [admin, viewer]
    |> Enum.each(fn x->
      Repo.insert(Permission.changeset(%Permission{}, %{name: "Dashboard.show", permission_set_id: x.id}))
      Repo.insert(Permission.changeset(%Permission{},%{name: "Question.show", permission_set_id: x.id}))
    end)

    [maker]
    |> Enum.each(fn x ->
      Repo.insert(Permission.changeset(%Permission{}, %{name: "Dashboard.show", permission_set_id: x.id}))
      Repo.insert(Permission.changeset(%Permission{}, %{name: "Dashboard.edit", permission_set_id: x.id}))
      Repo.insert(Permission.changeset(%Permission{}, %{name: "Dashboard.create", permission_set_id: x.id}))
      Repo.insert(Permission.changeset(%Permission{}, %{name: "Dashboard.delete", permission_set_id: x.id}))
      
      Repo.insert(Permission.changeset(%Permission{}, %{name: "Question.show", permission_set_id: x.id}))
      Repo.insert(Permission.changeset(%Permission{}, %{name: "Question.edit", permission_set_id: x.id}))
      Repo.insert(Permission.changeset(%Permission{}, %{name: "Question.create", permission_set_id: x.id}))
      Repo.insert(Permission.changeset(%Permission{}, %{name: "Question.delete", permission_set_id: x.id}))
    end)

    [admin]
    |> Enum.each(fn x ->
      Repo.insert(Permission.changeset(%Permission{}, %{name: "Dashboard.edit", permission_set_id: x.id}))
      Repo.insert(Permission.changeset(%Permission{}, %{name: "Dashboard.create", permission_set_id: x.id}))
      Repo.insert(Permission.changeset(%Permission{}, %{name: "Dashboard.delete", permission_set_id: x.id}))
      
      Repo.insert(Permission.changeset(%Permission{}, %{name: "Question.edit", permission_set_id: x.id}))
      Repo.insert(Permission.changeset(%Permission{}, %{name: "Question.create", permission_set_id: x.id}))
      Repo.insert(Permission.changeset(%Permission{}, %{name: "Question.delete", permission_set_id: x.id}))
      Repo.insert(Permission.changeset(%Permission{}, %{name: "Settings.all", permission_set_id: x.id}))
    end)

  end
end
