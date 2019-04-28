defmodule AfterGlow.Teams.TeamDatabase do
  use Ecto.Schema
  import Ecto.Changeset
  alias AfterGlow.Teams.Team
  alias AfterGlow.Database

  schema("user_teams") do
    belongs_to(:team, Team)
    belongs_to(:database, Database)
    timestamps()
  end

  def changeset(%__MODULE__{} = struct, attrs) when is_map(attrs) do
    struct
    |> cast(attrs, [:team_id, :database_id])
    |> validate_required([:team_id, :database_id])
  end
end
