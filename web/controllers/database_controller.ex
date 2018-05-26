defmodule AfterGlow.DatabaseController do
  use AfterGlow.Web, :controller

  alias AfterGlow.Database
  alias JaSerializer.Params
  alias AfterGlow.Async
  alias AfterGlow.SchemaTasks
  alias AfterGlow.CacheWrapper
  alias AfterGlow.CacheWrapper.Repo

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)
  plug(:authorize!, Database)
  plug(:scrub_params, "data" when action in [:create, :update])
  plug(:verify_authorized)

  def index(conn, _params) do
    databases =
      Repo.all(from(d in Database, select: [:id]))
      |> Enum.map(fn x -> x.id end)
      |> CacheWrapper.get_by_ids(Database)
      |> Repo.preload(:tables)

    render(conn, :index, data: databases)
  end

  def create(conn, %{"data" => data = %{"type" => "databases", "attributes" => _database_params}}) do
    changeset = Database.changeset(%Database{}, Params.to_attributes(data))

    case Database.insert(changeset) do
      {:ok, database} ->
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
    database = Repo.get!(Database, id) |> Repo.preload(:tables)
    render(conn, :show, data: database)
  end

  def sync(conn, %{"id" => id}) do
    database = Repo.get!(Database, id) |> Repo.preload(:tables)
    Async.perform(&SchemaTasks.sync/1, [database])
    render(conn, :show, data: database)
  end

  # def update(conn, %{"id" => id, "data" => data = %{"type" => "database", "attributes" => _database_params}}) do
  #   database = Repo.get!(Database, id)
  #   changeset = Database.changeset(database, Params.to_attributes(data))

  #   case Repo.update(changeset) do
  #     {:ok, database} ->
  #       render(conn, "show.json-api", data: database)
  #     {:error, changeset} ->
  #       conn
  #       |> put_status(:unprocessable_entity)
  #       |> render(:errors, data: changeset)
  #   end
  # end

  def delete(conn, %{"id" => id}) do
    database = Repo.get!(Database, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete_with_cache(database)

    send_resp(conn, :no_content, "")
  end
end
