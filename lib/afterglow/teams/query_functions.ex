defmodule AfterGlow.Teams.QueryFunctions do
  alias AfterGlow.Teams.Team
  alias AfterGlow.Repo
  alias AfterGlow.Teams.TeamDatabase
  alias AfterGlow.Teams.UserTeam
  import Ecto.Query

  @team_regex ~r/^"(.+)"@team$/

  def create(attrs) do
    Team.changeset(%Team{}, attrs)
    |> Repo.insert()
    |> preload_defaults
  end

  def get_users_by_name(name) do
    team =
      from(t in Team, where: t.name == ^name)
      |> Repo.all()
      |> Repo.preload([:users])

    if team |> length() > 0, do: (team |> Enum.at(0)).users, else: []
  end

  def get_name_from_pseudonym(pseudonym) do
    match = Regex.scan(@team_regex, pseudonym)

    if match |> length == 0 do
      nil
    else
      match
      |> Enum.at(0)
      |> Enum.at(1)
    end
  end

  def list() do
    Team
    |> Repo.all()
    |> preload_defaults
  end

  def get(id) do
    Repo.get!(Team, id)
    |> preload_defaults
  end

  def update(id, attrs) do
    get(id)
    |> Team.changeset(attrs)
    |> Repo.update()
    |> preload_defaults
  end

  def delete(id) do
    get(id)
    |> Repo.delete()
  end

  def add_database_to_team(database_id, team_id) do
    TeamDatabase.changeset(%TeamDatabase{}, %{database_id: database_id, team_id: team_id})
    |> Repo.insert()

    get(team_id)
  end

  def remove_database_from_team(database_id, team_id) do
    from(td in TeamDatabase, where: td.team_id == ^team_id and td.database_id == ^database_id)
    |> Repo.delete_all()

    get(team_id)
  end

  def add_user_to_team(user_id, team_id) do
    UserTeam.changeset(%UserTeam{}, %{user_id: user_id, team_id: team_id})
    |> Repo.insert()

    get(team_id)
  end

  def remove_user_from_team(user_id, team_id) do
    from(ut in UserTeam, where: ut.team_id == ^team_id and ut.user_id == ^user_id)
    |> Repo.delete_all()

    get(team_id)
  end

  defp preload_defaults({:ok, queryable}) do
    {:ok, queryable |> Repo.preload([:users, :accessible_databases])}
  end

  defp preload_defaults(error = {:error, _anything}) do
    error
  end

  defp preload_defaults(queryable) do
    queryable |> Repo.preload([:users, :accessible_databases])
  end
end
