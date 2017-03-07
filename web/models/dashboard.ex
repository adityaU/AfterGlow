defmodule SimpleBase.Dashboard do
  use SimpleBase.Web, :model

  schema "dashboards" do
    field :title, :string
    field :update_interval, :integer
    field :last_updated, Ecto.DateTime

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title, :update_interval, :last_updated])
    |> validate_required([:title, :update_interval, :last_updated])
  end
end
