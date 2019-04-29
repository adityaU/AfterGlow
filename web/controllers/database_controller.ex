defmodule AfterGlow.DatabaseController do
  use AfterGlow.Web, :controller
  import Ecto.Query
  alias AfterGlow.Database
  alias JaSerializer.Params
  alias AfterGlow.Async
  alias AfterGlow.SchemaTasks
  alias AfterGlow.DatabaseWithConfigView
  alias AfterGlow.CacheWrapper
  alias AfterGlow.CacheWrapper.Repo
  import AfterGlow.Policy.Helpers

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)
  plug(:authorize!, Database)
  plug(:scrub_params, "data" when action in [:create, :update])
  plug(:verify_authorized)

  def index(conn, %{"id" => id, "include_config" => "true"}) do
    if has_permission(conn.assigns.current_user, ["Settings.all"]) do
      database = scope(conn, from(d in Database, where: d.id == ^id)) |> Repo.one()

      json(
        conn,
        DatabaseWithConfigView
        |> JaSerializer.format(database, conn, type: 'database')
      )
    else
      conn
      |> put_status(:unauthorized)
      |> json(%{error: "not_permitted"})
    end
  end

  def index(conn, _params) do
    databases =
      scope(conn, from(d in Database, select: [:id]))
      |> Repo.all()
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
    database =
      scope(conn, from(d in Database, where: d.id == ^id)) |> Repo.one() |> Repo.preload(:tables)

    render(conn, :show, data: database)
  end

  def sync(conn, %{"id" => id}) do
    database =
      scope(conn, from(d in Database, where: d.id == ^id)) |> Repo.one() |> Repo.preload(:tables)

    Async.perform(&SchemaTasks.sync/1, [database])
    render(conn, :show, data: database)
  end

  def update(conn, %{
        "id" => id,
        "data" => data = %{"type" => "databases", "attributes" => _database_params}
      }) do
    database = Repo.get!(Database, id)
    changeset = Database.changeset(database, Params.to_attributes(data))

    case Database.update(changeset) do
      {:ok, database} ->
        render(conn, :show, data: database |> Repo.preload(:tables))

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
    Repo.delete_with_cache(database)

    send_resp(conn, :no_content, "")
  end
end
