defmodule AfterGlow.Teams.Team do
  use Ecto.Schema
  import Ecto.Changeset
  alias AfterGlow.Database
  alias AfterGlow.User
  alias AfterGlow.Teams.UserTeam
  alias AfterGlow.Teams.TeamDatabase

  schema("teams") do
    field(:name, :string)
    field(:description, :string)
    many_to_many(:users, User, join_through: UserTeam)
    many_to_many(:accessible_databases, Database, join_through: TeamDatabase)
    timestamps()
  end

  def changeset(%__MODULE__{} = struct, attrs) when is_map(attrs) do
    struct
    |> cast(attrs, [:name, :description])
    |> validate_required([:name])
  end
end
