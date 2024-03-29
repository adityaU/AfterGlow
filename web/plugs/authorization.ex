defmodule AfterGlow.Plugs.Authorization do
  import Joken
  @behaviour Plug
  import Plug.Conn
  alias AfterGlow.CacheWrapper.Repo
  alias AfterGlow.User
  alias AfterGlow.CacheWrapper

  def init(_opts) do
    %{}
  end

  def create_token(entity) do
    entity
    |> token()
    |> with_signer(hs256("my_secret"))
    |> sign
    |> get_compact
  end

  def verify_token(t) do
    t
    |> token
    |> with_signer(hs256("my_secret"))
    |> verify
  end

  def call(conn, _opts) do
    access_token = get_req_header(conn, "authorization")

    case access_token do
      nil ->
        raise Bodyguard.NotAuthorizedError, message: "No auth token found"

      _ ->
        handle_access_token(conn, access_token)
    end
  end

  defp handle_access_token(conn, access_token) do
    verified =
      access_token
      |> Enum.at(0)
      |> verify_token

    case verified.error do
      nil -> set_current_user(conn, verified.claims)
      _ -> raise Bodyguard.NotAuthorizedError, message: "invalid token"
    end
  end

  defp set_current_user(conn, user) do
    current_user =
      CacheWrapper.get_by_id(User, user["id"])
      |> Repo.preload([[permission_sets: :permissions], :organization])

    if current_user.organization && current_user.organization.is_deactivated do
      raise Bodyguard.NotAuthorizedError, message: "organization deactivated"
    end

    if current_user.is_deactivated do
      raise Bodyguard.NotAuthorizedError, message: "user deactivated"
    end

    conn
    |> assign(:current_user, current_user)
  end
end
