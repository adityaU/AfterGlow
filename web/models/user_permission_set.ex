defmodule AfterGlow.UserPermissionSet do
  use AfterGlow.Web, :model

  schema "user_permission_sets" do
    belongs_to :user, AfterGlow.User
    belongs_to :permission_set, AfterGlow.PermissionSet
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
