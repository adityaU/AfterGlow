require IEx
defmodule AfterGlow.User do
  use AfterGlow.Web, :model

  alias AfterGlow.PermissionSet
  alias AfterGlow.Permission
  alias AfterGlow.UserPermissionSet
  alias AfterGlow.CacheWrapper.Repo

  schema "users" do
    field :first_name, :string
    field :last_name, :string
    field :full_name, :string
    field :email, :string
    field :profile_pic, :string
    field :metadata, :map
    many_to_many :permission_sets, PermissionSet, join_through: UserPermissionSet, on_delete: :delete_all, on_replace: :delete
    many_to_many :permissions, Permission, join_through: PermissionSet, on_delete: :nothing
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:first_name, :last_name, :full_name, :email, :metadata, :profile_pic])
    |> validate_required([:email])
  end

  def default_preloads do
    [permission_sets: :permissions]
  end
  def cache_deletable_associations do
    []
  end

  def update(changeset, nil), do: Repo.update_with_cache(changeset)
  def update(changeset, permission_sets) do
    changeset = changeset |> update_permission_sets(permission_sets)
    Repo.update_with_cache(changeset)
  end

  defp update_permission_sets(changeset, permission_sets) do
    case permission_sets |> Enum.empty? do
      true-> changeset
      false -> changeset |> Ecto.Changeset.put_assoc(:permission_sets, permission_sets)
    end
  end

end
