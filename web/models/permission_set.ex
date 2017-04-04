defmodule AfterGlow.PermissionSet do
  use AfterGlow.Web, :model

  schema "permission_sets" do
    field :name, :string
    has_many :permissions, AfterGlow.Permission
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name])
    |> validate_required([:name])
  end
end
