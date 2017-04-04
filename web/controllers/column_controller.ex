defmodule AfterGlow.ColumnController do
  use AfterGlow.Web, :controller

  alias AfterGlow.Column
  alias JaSerializer.Params
  alias AfterGlow.Plugs.Authorization

  plug Authorization
  plug :authorize!, Column
  plug :scrub_params, "data" when action in [:create, :update]
  plug :verify_authorized

  def index(conn, %{"filter" => %{"id" =>ids}}) do
    ids = ids |> String.split(",")
    tables = Repo.all(from t in Column, where: t.id in ^ids ) |> Repo.preload(:column_values)
    render(conn, :index, data: tables)
  end

  # def index(conn, _params) do
  #   columns = Repo.all(Column)
  #   render(conn, "index.json-api", data: columns)
  # end

  # def create(conn, %{"data" => data = %{"type" => "column", "attributes" => _column_params}}) do
  #   changeset = Column.changeset(%Column{}, Params.to_attributes(data))

  #   case Repo.insert(changeset) do
  #     {:ok, column} ->
  #       conn
  #       |> put_status(:created)
  #       |> put_resp_header("location", column_path(conn, :show, column))
  #       |> render("show.json-api", data: column)
  #     {:error, changeset} ->
  #       conn
  #       |> put_status(:unprocessable_entity)
  #       |> render(:errors, data: changeset)
  #   end
  # end

  def show(conn, %{"id" => id}) do
    column = Repo.get!(Column, id)  |> Repo.preload(:column_values)
    render(conn, "show.json-api", data: column)
  end

  # def update(conn, %{"id" => id, "data" => data = %{"type" => "column", "attributes" => _column_params}}) do
  #   column = Repo.get!(Column, id)
  #   changeset = Column.changeset(column, Params.to_attributes(data))

  #   case Repo.update(changeset) do
  #     {:ok, column} ->
  #       render(conn, "show.json-api", data: column)
  #     {:error, changeset} ->
  #       conn
  #       |> put_status(:unprocessable_entity)
  #       |> render(:errors, data: changeset)
  #   end
  # end

  # def delete(conn, %{"id" => id}) do
  #   column = Repo.get!(Column, id)

  #   # Here we use delete! (with a bang) because we expect
  #   # it to always work (and if it does not, it will raise).
  #   Repo.delete!(column)

  #   send_resp(conn, :no_content, "")
  # end

end
