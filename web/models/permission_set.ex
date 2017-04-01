defmodule SimpleBase.PermissionSet do
  use SimpleBase.Web, :model

  schema "permission_sets" do
    field :name, :string
    has_many :permissions, SimpleBase.Permission
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
