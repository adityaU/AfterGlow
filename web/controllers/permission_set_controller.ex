defmodule SimpleBase.PermissionSetController do
  use SimpleBase.Web, :controller

  alias SimpleBase.PermissionSet
  alias JaSerializer.Params

  alias SimpleBase.Plugs.Authorization
  plug Authorization
  plug :authorize!, PermissionSet
  plug :scrub_params, "data" when action in [:create, :update]
  plug :verify_authorized


  def index(conn, _params) do
    permission_sets = Repo.all(PermissionSet) |> Repo.preload(:permissions)
    render(conn, :index, data: permission_sets)
  end

  def create(conn, %{"data" => data = %{"type" => "permission_set", "attributes" => _permission_set_params}}) do
    changeset = PermissionSet.changeset(%PermissionSet{}, Params.to_attributes(data))

    case Repo.insert(changeset) do
      {:ok, permission_set} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", permission_set_path(conn, :show, permission_set))
        |> render("show.json-api", data: permission_set)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    permission_set = Repo.get!(PermissionSet, id)
    render(conn, "show.json-api", data: permission_set)
  end

  def update(conn, %{"id" => id, "data" => data = %{"type" => "permission_set", "attributes" => _permission_set_params}}) do
    permission_set = Repo.get!(PermissionSet, id)
    changeset = PermissionSet.changeset(permission_set, Params.to_attributes(data))

    case Repo.update(changeset) do
      {:ok, permission_set} ->
        render(conn, "show.json-api", data: permission_set)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    permission_set = Repo.get!(PermissionSet, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(permission_set)

    send_resp(conn, :no_content, "")
  end

end
