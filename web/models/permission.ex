defmodule SimpleBase.Permission do
  use SimpleBase.Web, :model

  schema "permissions" do
    field :name, :string
    belongs_to :permission_set, PermissionSet
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :permission_set_id])
    |> validate_required([:name, :permission_set_id])
  end
end
