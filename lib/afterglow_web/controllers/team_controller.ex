defmodule AfterGlow.TeamController do
  use AfterGlow.Web, :controller

  alias AfterGlow.Teams.QueryFunctions, as: Teams
  alias AfterGlow.Teams.Team

  alias JaSerializer.Params

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)
  plug(:authorize!, Team)
  plug(:verify_authorized)

  action_fallback(AfterGlow.Web.FallbackController)

  def index(conn, _params) do
    teams = Teams.list()
    render(conn, "index.json", teams: teams)
  end

  def show(conn, %{"id" => id}) do
    team = Teams.get(id)
    render(conn, "show.json", team: team)
  end

  def create(conn, %{"data" => data = %{"type" => "teams", "attributes" => _teams_params}}) do
    prms = Params.to_attributes(data)

    with {:ok, %Team{} = team} <- Teams.create(prms) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", team_path(conn, :show, team))
      |> render("show.json", team: team)
    end
  end

  def update(conn, %{
        "data" => data = %{"id" => id, "type" => "teams", "attributes" => _teams_params}
      }) do
    prms = Params.to_attributes(data)

    with {:ok, %Team{} = team} <- Teams.update(id, prms) do
      conn
      |> put_resp_header("location", team_path(conn, :show, team))
      |> render("show.json", team: team)
    end
  end

  def delete(conn, %{"id" => id}) do
    Teams.delete(id)

    send_resp(conn, :no_content, "")
  end

  def add_user(conn, %{"id" => team_id, "user_id" => user_id}) do
    team = Teams.add_user_to_team(user_id, team_id)

    conn
    |> render("show.json", team: team)
  end

  def remove_user(conn, %{"id" => team_id, "user_id" => user_id}) do
    team = Teams.remove_user_from_team(user_id, team_id)

    conn
    |> render("show.json", team: team)
  end

  def add_database(conn, %{"id" => team_id, "database_id" => database_id}) do
    team = Teams.add_database_to_team(database_id, team_id)

    conn
    |> render("show.json", team: team)
  end

  def remove_database(conn, %{"id" => team_id, "database_id" => database_id}) do
    team = Teams.remove_database_from_team(database_id, team_id)

    conn
    |> render("show.json", team: team)
  end
end
