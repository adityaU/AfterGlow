defmodule AfterGlow.Teams.UserTeam do
  use Ecto.Schema
  import Ecto.Changeset
  alias AfterGlow.Teams.Team
  alias AfterGlow.User

  schema("user_teams") do
    belongs_to(:team, Team)
    belongs_to(:user, User)
    timestamps()
  end

  def changeset(%__MODULE__{} = struct, attrs) when is_map(attrs) do
    struct
    |> cast(attrs, [:team_id, :user_id])
    |> validate_required([:team_id, :user_id])
  end
end
