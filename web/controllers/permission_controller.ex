defmodule SimpleBase.PermissionController do
  use SimpleBase.Web, :controller

  alias SimpleBase.Permission
  alias JaSerializer.Params

  alias SimpleBase.Plugs.Authorization
  plug Authorization
  plug :authorize!, Permission
  plug :scrub_params, "data" when action in [:create, :update]
  plug :verify_authorized

  def index(conn, _params) do
    permissions = Repo.all(Permission)
    render(conn, :index, data: permissions)
  end

  def index(conn, %{"filter" => %{"id" =>ids}}) do
    ids = ids |> String.split(",")
    tables = Repo.all(from p in Permission, where: p.id in ^ids )
    render(conn, :index, data: tables)
  end
  def create(conn, %{"data" => data = %{"type" => "permission", "attributes" => _permission_params}}) do
    changeset = Permission.changeset(%Permission{}, Params.to_attributes(data))

    case Repo.insert(changeset) do
      {:ok, permission} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", permission_path(conn, :show, permission))
        |> render("show.json-api", data: permission)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    permission = Repo.get!(Permission, id)
    render(conn, "show.json-api", data: permission)
  end

  def update(conn, %{"id" => id, "data" => data = %{"type" => "permission", "attributes" => _permission_params}}) do
    permission = Repo.get!(Permission, id)
    changeset = Permission.changeset(permission, Params.to_attributes(data))

    case Repo.update(changeset) do
      {:ok, permission} ->
        render(conn, "show.json-api", data: permission)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    permission = Repo.get!(Permission, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(permission)

    send_resp(conn, :no_content, "")
  end

end
