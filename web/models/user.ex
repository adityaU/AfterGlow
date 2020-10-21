require IEx

defmodule AfterGlow.User do
  use AfterGlow.Web, :model

  alias AfterGlow.PermissionSet
  alias AfterGlow.Permission
  alias AfterGlow.Teams.UserTeam
  alias AfterGlow.Teams.Team
  alias AfterGlow.UserPermissionSet
  alias AfterGlow.CacheWrapper.Repo
  alias AfterGlow.Organizations.Organization
  alias AfterGlow.Settings.UserSettingsQueryFunctions, as: UserSettings
  alias AfterGlow.Organizations.OrganizationsQueryFunctions, as: Organizations

  schema "users" do
    field(:first_name, :string)
    field(:last_name, :string)
    field(:full_name, :string)
    field(:email, :string)
    field(:profile_pic, :string)
    field(:metadata, :map)
    field(:is_deactivated, :boolean)
    field(:password, :string)
    belongs_to(:organization, Organization)

    many_to_many(
      :permission_sets,
      PermissionSet,
      join_through: UserPermissionSet,
      on_delete: :delete_all,
      on_replace: :delete
    )

    many_to_many(:permissions, Permission, join_through: PermissionSet, on_delete: :nothing)
    many_to_many(:teams, Team, join_through: UserTeam, on_delete: :nothing)

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [
      :first_name,
      :last_name,
      :full_name,
      :email,
      :metadata,
      :profile_pic,
      :is_deactivated,
      :password,
      :organization_id
    ])
    |> validate_required([:email])
    |> encrypt_password()
  end

  def default_preloads do
    [[permission_sets: :permissions]]
  end

  def cache_deletable_associations do
    []
  end

  def update(changeset, nil), do: Repo.update_with_cache(changeset)

  def update(changeset, permission_sets) do
    changeset = changeset |> update_permission_sets(permission_sets)
    Repo.update_with_cache(changeset)
  end

  def set_organization(user) do
    organization =
      Organizations.find_by_google_domain(user.email |> String.split("@") |> Enum.at(-1))

    if organization do
      changeset(user, %{organization_id: organization.id})
      |> Repo.update_with_cache()
    else
      {:ok, user}
    end
  end

  def encrypt(str) do
     :crypto.hash(:sha256, str) |> Base.encode64 |> String.downcase
  end

  def encrypt_password(user) do
    if Map.has_key?( user.changes, :password) do
      Ecto.Changeset.change(user, %{ password: encrypt(user.changes[:password])})
    else
      user
    end
  end

  def save_or_update_user(user) do
    verifiedUser = if user["names"] |> Enum.at(0) do
      %{
        "given_name" => user["names"] |> Enum.at(0) |> Access.get("ga1ivenName"),
        "family_name" => user["names"] |> Enum.at(0) |> Access.get("familyName"),
        "name" => user["names"] |> Enum.at(0) |> Access.get("displayName")
      }
    else 
      %{}
    end

    verifiedUser =  verifiedUser |> Map.merge(%{"email" =>  user["emailAddresses"] |> Enum.at(0) |> Access.get("value")})
    saved_user = Repo.one(from(u in __MODULE__, where: u.email == ^verifiedUser["email"]))


    {:ok, user} =
      if saved_user do
        changeset =
          __MODULE__.changeset(saved_user, %{
            email: verifiedUser["email"],
            first_name: verifiedUser["given_name"],
            last_name: verifiedUser["family_name"],
            metadata: user,
            full_name: verifiedUser["name"]
          })

        Repo.update_with_cache(changeset)
      else
        changeset =
          __MODULE__.changeset(%__MODULE__{}, %{
            email: verifiedUser["email"],
            first_name: verifiedUser["given_name"],
            last_name: verifiedUser["family_name"],
            metadata: user,
            full_name: verifiedUser["name"]
          })

        {:ok, u} = Repo.insert_with_cache(changeset)
        permission_set = Repo.one(from(ps in PermissionSet, where: ps.name == "Viewer"))

        Repo.insert_with_cache(
          UserPermissionSet.changeset(%UserPermissionSet{}, %{
            user_id: u.id,
            permission_set_id: permission_set.id
          })
        )

        {:ok, u}
      end

    {:ok, user} = set_organization(user)
    UserSettings.verify_general_settings(user)
    {:ok, user}
  end

  defp update_permission_sets(changeset, permission_sets) do
    case permission_sets |> Enum.empty?() do
      true -> changeset
      false -> changeset |> Ecto.Changeset.put_assoc(:permission_sets, permission_sets)
    end
  end
end
