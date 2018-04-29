defmodule AfterGlow.VariableController do
  use AfterGlow.Web, :controller

  alias AfterGlow.Variable
  alias JaSerializer.Params
  alias AfterGlow.CacheWrapper.Repo

  plug :scrub_params, "data" when action in [:create, :update]

  def index(conn, %{"filter" => %{"id" => ids}}) do
    ids = ids |> String.split(",")
    variables = (from v in Variable, where: v.id in ^ids) |> Repo.all()
    render(conn, :index, data: variables)
  end

  def create(conn, %{"data" => data = %{"type" => "variables", "attributes" => _variable_params}}) do
    changeset = Variable.changeset(%Variable{}, Params.to_attributes(data))
    require IEx
    IEx.pry

    case Repo.insert_with_cache(changeset) do
      {:ok, variable} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", variable_path(conn, :show, variable))
        |> render(:show, data: variable)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    variable = Repo.get!(Variable, id)
    render(conn, :show, data: variable)
  end

  def update(conn, %{"id" => id, "data" => data = %{"type" => "variables", "attributes" => _variable_params}}) do
    variable = Repo.get!(Variable, id)
    changeset = Variable.changeset(variable, Params.to_attributes(data))

    case Repo.update_with_cache(changeset) do
      {:ok, variable} ->
        render(conn, :show, data: variable)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    variable = Repo.get!(Variable, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete_with_cache(variable)

    send_resp(conn, :no_content, "")
  end

end
