defmodule AfterGlow.Organizations.Organization do
  use AfterGlow.Web, :model
  alias AfterGlow.User

  @cast_params [:name, :google_domain, :is_deactivated]
  @required_params @cast_params
  schema "organizations" do
    field(:name, :string)
    field(:google_domain, :string)
    field(:is_deactivated, :boolean, default: false)
    has_many(:users, User)
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @cast_params)
    |> validate_required(@required_params)
    |> unique_constraint(:google_domain)
    |> unique_constraint(:name)
    |> validate_format(
      :google_domain,
      ~r/^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/,
      message: "Invalid domain"
    )
  end
end
