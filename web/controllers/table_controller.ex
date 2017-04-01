defmodule SimpleBase.TableController do
  use SimpleBase.Web, :controller

  alias SimpleBase.Table
  alias JaSerializer.Params
  alias SimpleBase.Plugs.Authorization

  plug Authorization
  plug :authorize!, Table
  plug :scrub_params, "data" when action in [:create, :update]
  plug :verify_authorized

  def index(conn, %{"filter" => %{"id" =>ids}}) do
    ids = ids |> String.split(",")
    tables = Repo.all(from t in Table, where: t.id in ^ids ) |> Repo.preload(:columns)
    render(conn, :index, data: tables)
  end

  # def index(conn, _params) do
  #   tables = Repo.all(Table)
  #   render(conn, "index.json-api", data: tables)
  # end

  def create(conn, %{"data" => data = %{"type" => "table", "attributes" => _table_params}}) do
    changeset = Table.changeset(%Table{}, Params.to_attributes(data))

    case Repo.insert(changeset) do
      {:ok, table} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", table_path(conn, :show, table))
        |> render("show.json-api", data: table)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    table = Repo.get!(Table, id)
    render(conn, "show.json-api", data: table)
  end

  def update(conn, %{"id" => id, "data" => data = %{"type" => "table", "attributes" => _table_params}}) do
    table = Repo.get!(Table, id)
    changeset = Table.changeset(table, Params.to_attributes(data))

    case Repo.update(changeset) do
      {:ok, table} ->
        render(conn, "show.json-api", data: table)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    table = Repo.get!(Table, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(table)

    send_resp(conn, :no_content, "")
  end

end
