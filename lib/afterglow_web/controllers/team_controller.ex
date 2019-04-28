defmodule AfterGlow.TeamController do
  use AfterGlow.Web, :controller

  alias AfterGlow.Teams.QueryFunctions, as: Teams
  alias AfterGlow.Teams.Team

  alias JaSerializer.Params

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)

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
      |> put_resp_header("location", snapshot_path(conn, :show, team))
      |> render("show.json", team: team)
    end
  end
end
