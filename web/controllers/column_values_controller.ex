defmodule SimpleBase.ColumnValueController do
  use SimpleBase.Web, :controller

  alias SimpleBase.ColumnValue
  alias JaSerializer.Params
  alias SimpleBase.Plugs.Authorization

  plug Authorization
  plug :authorize!, ColumnValue
  plug :scrub_params, "data" when action in [:create, :update]
  plug :verify_authorized

  def index(conn, %{"filter" => %{"id" =>ids}}) do
    ids = ids |> String.split(",")
    column_values = Repo.all(from t in ColumnValue, where: t.id in ^ids )
    render(conn, :index, data: column_values)
  end

  def create(conn, %{"data" => data = %{"type" => "column_value", "attributes" => _column_value_params}}) do
    changeset = ColumnValue.changeset(%ColumnValue{}, Params.to_attributes(data))

    case Repo.insert(changeset) do
      {:ok, column_value} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", column_value_path(conn, :show, column_value))
        |> render("show.json-api", data: column_value)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    column_value = Repo.get!(ColumnValue, id)
    render(conn, :show, data: column_value)
  end

  def update(conn, %{"id" => id, "data" => data = %{"type" => "column_value", "attributes" => _column_value_params}}) do
    column_value = Repo.get!(ColumnValue, id)
    changeset = ColumnValue.changeset(column_value, Params.to_attributes(data))

    case Repo.update(changeset) do
      {:ok, column_value} ->
        render(conn, "show.json-api", data: column_value)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    column_value = Repo.get!(ColumnValue, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(column_value)

    send_resp(conn, :no_content, "")
  end

end
