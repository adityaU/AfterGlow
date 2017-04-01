defmodule SimpleBase.UserPermissionSet do
  use SimpleBase.Web, :model

  schema "user_permission_sets" do
    belongs_to :user, SimpleBase.User
    belongs_to :permission_set, SimpleBase.PermissionSet
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:user_id, :permission_set_id])
    |> validate_required([:user_id, :permission_set_id])
  end
end
