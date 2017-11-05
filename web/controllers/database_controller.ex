defmodule AfterGlow.DatabaseController do
  use AfterGlow.Web, :controller
  require IEx
  alias AfterGlow.Database
  alias JaSerializer.Params

  alias AfterGlow.Plugs.Authorization
  plug Authorization
  plug :authorize!, Database
  plug :scrub_params, "data" when action in [:create, :update]
  plug :verify_authorized

  def index(conn, _params) do
    databases = Repo.all(Database) |> Repo.preload(:tables)
    databases |> update_tables_of_all_databases
    render(conn, :index, data: databases)
  end

  def create(conn, %{"data" => data = %{"type" => "databases", "attributes" => _database_params}}) do
    changeset = Database.changeset(%Database{}, Params.to_attributes(data))
    case Database.insert(changeset) do
      {:ok, database} ->
        Database.sync_db(database)
        database = database |> Repo.preload(:tables)
        conn
        |> put_status(:created)
        |> put_resp_header("location", database_path(conn, :show, database))
        |> render(:show, data: database)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    database = Repo.get!(Database, id)
    render(conn, "show.json-api", data: database)
  end

  def update(conn, %{"id" => id, "data" => data = %{"type" => "database", "attributes" => _database_params}}) do
    database = Repo.get!(Database, id)
    changeset = Database.changeset(database, Params.to_attributes(data))

    case Repo.update(changeset) do
      {:ok, database} ->
        render(conn, "show.json-api", data: database)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    database = Repo.get!(Database, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(database)

    send_resp(conn, :no_content, "")
  end

  def test_connection(conn, %{"db_url" => db_url}) do
    payload = "{\"args\" : [\"#{db_url}\"]}"
    {:ok, resp} = HTTPoison.post(
      Application.get_env(:afterglow, :worker_url) <> "/api/task/apply/query_runner.test_connection",
      payload,
      [{"Content-Type" , "application/json"}],
      [recv_timeout: 100000]
    )
    {:ok, resp} = Poison.decode(resp.body)
    if resp["result"]["success"] == false do
      conn = conn |> put_status(422)
    end
    conn
    |> render "test_connection.json", resp["result"]
  end

  defp update_tables_of_all_databases databases do
    databases
    |> Enum.each(fn db ->
      Database.update_all_tables(db, false)
    end)
  end
end
