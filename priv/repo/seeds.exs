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

defmodule AfterGlow.Repo.Seed do
  alias AfterGlow.Repo
  alias AfterGlow.PermissionSet
  alias AfterGlow.UserPermissionSet
  alias AfterGlow.Permission
  alias AfterGlow.User
  alias AfterGlow.Database
  alias AfterGlow.ApiActions.ApiAction
  alias AfterGlow.Settings.GlobalSettingsQueryFunctions, as: GlobalSettings
  alias AfterGlow.Settings.UserSettingsQueryFunctions, as: UserSettings
  alias AfterGlow.Settings.OrganizationSettingsQueryFunctions, as: OrganizationSettings
  alias AfterGlow.Organizations.Organization

  import Ecto.Query

  def find_or_create_permission_set(name) do
    Repo.get_by(PermissionSet, %{name: name}) ||
      Repo.insert!(PermissionSet.changeset(%PermissionSet{}, %{name: name}))
  end

  def find_or_create_permission(name, permission_set_id) do
    Repo.get_by(Permission, %{name: name, permission_set_id: permission_set_id}) ||
      Repo.insert!(
        Permission.changeset(
          %Permission{},
          %{name: name, permission_set_id: permission_set_id}
        )
      )
  end

  def seed do
    IO.inspect("Running Seeds...")

    [admin, viewer, creator] =
      ["Admin", "Viewer", "Creator"]
      |> Enum.map(fn x ->
        find_or_create_permission_set(x)
      end)

    [admin, viewer, creator]
    |> Enum.each(fn x ->
      ["Dashboard.show", "Question.show"]
      |> Enum.each(fn y ->
        find_or_create_permission(y, x.id)
      end)
    end)

    [creator, admin]
    |> Enum.each(fn x ->
      [
        "Dashboard.edit",
        "Dashboard.create",
        "Dashboard.delete",
        "Question.edit",
        "Question.create",
        "Question.delete"
      ]
      |> Enum.each(fn y ->
        find_or_create_permission(y, x.id)
      end)
    end)

    find_or_create_permission("Settings.all", admin.id)

    if Application.get_env(:afterglow, :admin_email) do
      admin_user =
        Repo.one(
          from(u in User, where: u.email == ^Application.get_env(:afterglow, :admin_email))
        )

      admin_user =
        unless admin_user do
          Repo.insert!(
            User.changeset(%User{}, %{email: Application.get_env(:afterglow, :admin_email)})
          )
        else
          admin_user
        end

      Repo.get_by(UserPermissionSet, %{
        user_id: admin_user.id,
        permission_set_id: admin.id
      }) ||
        Repo.insert!(
          UserPermissionSet.changeset(%UserPermissionSet{}, %{
            user_id: admin_user.id,
            permission_set_id: admin.id
          })
        )

      system_user_email = "AG::System"
      admin_user = Repo.one(from(u in User, where: u.email == ^system_user_email))

      admin_user =
        unless admin_user do
          Repo.insert!(User.changeset(%User{}, %{email: system_user_email}))
        else
          admin_user
        end

      Repo.get_by(UserPermissionSet, %{
        user_id: admin_user.id,
        permission_set_id: admin.id
      }) ||
        Repo.insert!(
          UserPermissionSet.changeset(%UserPermissionSet{}, %{
            user_id: admin_user.id,
            permission_set_id: admin.id
          })
        )

      admin_user = Repo.one(from(u in User, where: u.email == "admin@example.com"))

      admin_user =
        unless admin_user do
          Repo.insert!(
            User.changeset(%User{}, %{email: "admin@example.com", password: "ag_admin_password"})
          )
        else
          admin_user
        end

      Repo.get_by(UserPermissionSet, %{
        user_id: admin_user.id,
        permission_set_id: admin.id
      }) ||
        Repo.insert!(
          UserPermissionSet.changeset(%UserPermissionSet{}, %{
            user_id: admin_user.id,
            permission_set_id: admin.id
          })
        )

      viewer_user = Repo.one(from(u in User, where: u.email == "viewer@example.com"))

      viewer_user =
        unless viewer_user do
          Repo.insert!(
            User.changeset(%User{}, %{email: "viewer@example.com", password: "ag_password"})
          )
        else
          viewer_user
        end

      Repo.get_by(UserPermissionSet, %{
        user_id: viewer_user.id,
        permission_set_id: viewer.id
      }) ||
        Repo.insert!(
          UserPermissionSet.changeset(%UserPermissionSet{}, %{
            user_id: viewer_user.id,
            permission_set_id: viewer.id
          })
        )
    end

    GlobalSettings.create_or_update_settings()

    User
    |> Repo.all()
    |> Enum.each(fn user ->
      User.set_organization(user)
      UserSettings.verify_general_settings(user)
    end)

    Organization
    |> Repo.all()
    |> Enum.each(fn org ->
      OrganizationSettings.verify_general_settings(org.id)
    end)

    api_client =
      Repo.one(
        from(u in Database, where: u.name == "Generic API Client" and u.db_type == "api_client")
      )

    unless api_client do
      Repo.insert!(
        Database.changeset(%Database{}, %{
          name: "Generic API Client",
          db_type: "api_client",
          config: %{}
        })
      )

      ApiAction
      |> Repo.all()
      |> Enum.each(fn api_action ->
        ApiAction.set_default_action_level(api_action)
      end)
    end
  end
end

AfterGlow.Repo.Seed.seed()
