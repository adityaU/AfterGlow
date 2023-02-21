defmodule AfterGlow.TableController do
  use AfterGlow.Web, :controller

  alias AfterGlow.Tables.QueryFunctions, as: Tables
  alias AfterGlow.Table
  alias JaSerializer.Params
  alias AfterGlow.Plugs.Authorization
  alias AfterGlow.CacheWrapper
  alias AfterGlow.CacheWrapper.Repo

  plug(Authorization)
  plug(:authorize!, Table)
  plug(:scrub_params, "data" when action in [:create, :update])
  plug(:verify_authorized)

  def index(conn, %{"filter" => %{"id" => ids}}) do
    ids = ids |> String.split(",")
    tables = CacheWrapper.get_by_ids(Table, ids) |> Repo.preload(:columns)
    render(conn, :index, data: tables)
  end

  def index(conn, %{"filter" => %{"database_id" => id}}) do
    tables = Tables.find_by_database_id(id) |> Repo.preload(:columns)
    render(conn, :index, data: tables)
  end

  # def index(conn, _params) do
  #   tables = Repo.all(Table)
  #   render(conn, "index.json-api", data: tables)
  # end

  # def create(conn, %{"data" => data = %{"type" => "table", "attributes" => _table_params}}) do
  #   changeset = Table.changeset(%Table{}, Params.to_attributes(data))

  #   case Repo.insert(changeset) do
  #     {:ok, table} ->
  #       conn
  #       |> put_status(:created)
  #       |> put_resp_header("location", table_path(conn, :show, table))
  #       |> render("show.json-api", data: table)
  #     {:error, changeset} ->
  #       conn
  #       |> put_status(:unprocessable_entity)
  #       |> render(:errors, data: changeset)
  #   end
  # end

  def show(conn, %{"id" => id}) do
    table = CacheWrapper.get_by_id(Table, id) |> Repo.preload(:columns)
    render(conn, :show, data: table)
  end

  def update(conn, %{
        "id" => id,
        "data" => data = %{"type" => "tables", "attributes" => _table_params}
      }) do
    table = CacheWrapper.get_by_id(Table, id)
    changeset = Table.update_changeset(table, Params.to_attributes(data))

    case Repo.update_with_cache(changeset) do
      {:ok, table} ->
        table = table |> Repo.preload(:columns)
        render(conn, :show, data: table)

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  # def delete(conn, %{"id" => id}) do
  #   table =  CacheWrapper.get_by_id(Table, [id])

  #   # Here we use delete! (with a bang) because we expect
  #   # it to always work (and if it does not, it will raise).
  #   Repo.delete!(table)

  #   send_resp(conn, :no_content, "")
  # end
end
