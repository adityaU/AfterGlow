defmodule AfterGlow.Teams.QueryFunctions do
  alias AfterGlow.Teams.Team
  alias AfterGlow.Repo
  alias AfterGlow.Teams.TeamDatabase
  alias AfterGlow.Teams.UserTeam
  import Ecto.Query

  def create(attrs) do
    Team.changeset(%Team{}, attrs)
    |> Repo.insert()
    |> preload_defaults
  end

  def list() do
    Team |> Repo.all()
  end

  def get(id) do
    Repo.get!(Team, id)
  end

  def update(id, attrs) do
    get(id)
    |> Team.changeset(attrs)
    |> Repo.update()
  end

  def add_database_to_team(database_id, team_id)
      when is_integer(database_id) and is_integer(team_id) do
    TeamDatabase.changeset(%TeamDatabase{}, %{database_id: database_id, team_id: team_id})
    |> Repo.insert()
  end

  def remove_database_from_team(database_id, team_id)
      when is_integer(database_id) and is_integer(team_id) do
    from(td in TeamDatabase, where: td.team_id == ^team_id and td.database_id == ^database_id)
    |> Repo.delete_all()
  end

  def list_database_for_team(team_id) when is_integer(team_id) do
    get(team_id)
    |> Repo.preload(:accessible_databases)
  end

  def add_user_to_team(user_id, team_id) when is_integer(user_id) and is_integer(team_id) do
    UserTeam.changeset(%UserTeam{}, %{user_id: user_id, team_id: team_id})
    |> Repo.insert()
  end

  def remove_user_from_team(user_id, team_id) when is_integer(user_id) and is_integer(team_id) do
    from(ut in UserTeam, where: ut.team_id == ^team_id and ut.user_id == ^user_id)
    |> Repo.delete_all()
  end

  def list_users_for_team(team_id) when is_integer(team_id) do
    get(team_id)
    |> Repo.preload(:users)
  end

  defp preload_defaults({:ok, queryable}) do
    {:ok, queryable |> Repo.preload([:users, :accessible_databases])}
  end

  defp preload_defaults(error = {:error, _anything}) do
    error
  end

  defp preload_defaults(queryable) do
    queryable |> Repo.preload(:users, :accessible_databases)
  end
end
