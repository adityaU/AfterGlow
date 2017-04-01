alias SimpleBase.Repo
alias SimpleBase.PermissionSet
alias SimpleBase.UserPermissionSet
alias SimpleBase.User
import Ecto.Query
admin_user = Repo.one(from u in User, where: u.email ==  ^Application.get_env(:simplebase, :admin_email) )
unless admin_user do
  Repo.insert(User, %{email:  Application.get_env(:simplebase, :ADMIN_EMAIL) })
end

admin = Repo.one(from ps in PermissionSet, where: ps.name == "Admin")
Repo.insert(UserPermissionSet.changeset(%UserPermissionSet{}, %{user_id: admin_user.id, permission_set_id: admin.id}))
