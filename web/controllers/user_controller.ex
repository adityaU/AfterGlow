require IEx
defmodule AfterGlow.UserController do
  use AfterGlow.Web, :controller
  alias AfterGlow.Repo
  alias AfterGlow.User
  alias AfterGlow.PermissionSet
  alias JaSerializer.Params
  alias AfterGlow.Plugs.Authorization
  alias AfterGlow.CacheWrapper

  import Ecto.Query

  plug Authorization
  plug :authorize!, User
  plug :scrub_params, "data" when action in [:create, :update]
  plug :verify_authorized

  def index(conn, %{"filter" => %{"id" =>ids}}) do
    ids = ids |> String.split(",")
    users = CacheWrapper.get_by_ids(User, ids ) |> Repo.preload(:permission_sets)
    render(conn, :index, data: users)
  end

  def index(conn, _params) do
    users = Repo.all(from u in User, select: [:id])
    |> Enum.map(fn x -> x.id end)
    |> CacheWrapper.get_by_ids(User)
    |> Repo.preload(:permission_sets)
    render(conn, :index, data: users)
  end
  # def create(conn, %{"data" => data = %{"type" => "user", "attributes" => _user_params}}) do
  #   changeset = User.changeset(%User{}, Params.to_attributes(data))

  #   case Repo.insert(changeset) do
  #     {:ok, user} ->
  #       conn
  #       |> put_status(:created)
  #       |> put_resp_header("location", user_path(conn, :show, user))
  #       |> render("show.json-api", data: user)
  #     {:error, changeset} ->
  #       conn
  #       |> put_status(:unprocessable_entity)
  #       |> render(:errors, data: changeset)
  #   end
  # end

  def show(conn, %{"id" => id}) do
    user = CacheWrapper.get_by_id(User, id)
    render(conn, :show, data: user)
  end

  # def update(conn, %{"id" => id, "data" => data = %{"type" => "users", "attributes" => _user_params}}) do

  #   prms =  Params.to_attributes(data)
  #   user = Repo.get!(User, id) |> Repo.preload(:permission_sets)
  #   changeset = User.changeset(user, Params.to_attributes(data))
  #   permission_set_ids = prms["permission_sets_ids"]
  #   permission_sets = if permission_set_ids && (permission_set_ids |> Enum.empty?) , do: nil, else: Repo.all(from q in PermissionSet, where: q.id in ^permission_set_ids )

  #   case User.update(changeset, permission_sets) do
  #     {:ok, user} ->
  #       render(conn, :show, data: user)
  #     {:error, changeset} ->
  #       conn
  #       |> put_status(:unprocessable_entity)
  #       |> render(:errors, data: changeset)
  #   end
  # end

  # def delete(conn, %{"id" => id}) do
  #   user = Repo.get!(User, id)

  #   # Here we use delete! (with a bang) because we expect
  #   # it to always work (and if it does not, it will raise).
  #   Repo.delete!(user)

  #   send_resp(conn, :no_content, "")
  # end

end
