# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     AfterGlow.Repo.insert!(%AfterGlow.SomeModel{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

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


admin_user = Repo.one(from u in User, where: u.email ==  ^Application.get_env(:afterglow, :admin_email) )
admin_user = unless admin_user do
  Repo.insert(User.changeset(%User{}, %{email:  Application.get_env(:afterglow, :admin_email) }))
else
  admin_user
end
Repo.insert(UserPermissionSet.changeset(%UserPermissionSet{}, %{user_id: admin_user.id, permission_set_id: admin.id}))

