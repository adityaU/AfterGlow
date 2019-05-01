defmodule AfterGlow.AuthController do
  use AfterGlow.Web, :controller
  alias AfterGlow.Oauth.Google
  alias AfterGlow.User
  alias AfterGlow.Permission
  alias AfterGlow.UserPermissionSet
  alias AfterGlow.PermissionSet
  alias AfterGlow.Plugs.Authorization
  alias AfterGlow.CacheWrapper
  alias AfterGlow.CacheWrapper.Repo

  def google_auth_path(conn, _params) do
    conn
    |> json(%{path: authorize_url!("google")})
  end

  def verify_token(conn, t) do
    verified =
      t["token"]
      |> Authorization.verify_token()

    if verified.error do
      conn
      |> put_status(:unauthorized)
      |> json(%{error: "invalid token"})
    else
      perm =
        CacheWrapper.get_by_id(User, verified.claims["id"])
        |> Repo.preload(permission_sets: :permissions)
        |> permissions

      conn
      |> json(%{success: true, user: verified.claims, permissions: perm})
    end
  end

  def permissions(user) do
    user.permission_sets
    |> Enum.map(fn x -> x.permissions |> Enum.map(fn y -> y.name end) end)
    |> List.flatten()
  end

  def callback(conn, %{"provider" => provider, "code" => code}) do
    code = URI.decode(code)
    token = get_token!(provider, code)
    user = get_user!(provider, token)

    case user |> validate_email do
      true ->
        {:ok, user} = save_or_update_user(user)
        auth_token = create_jwt(user)
        perm = user |> Repo.preload(permission_sets: :permissions) |> permissions

        conn
        |> put_status(:created)
        |> put_resp_header("content-type", "application/json")
        |> json(%{
          token: auth_token,
          permissions: perm,
          user: %{
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            profile_pic: user.profile_pic
          }
        })

      false ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{
          error:
            "Only #{Application.get_env(:afterglow, :allowed_google_domain)} users are allowed "
        })
    end
  end

  defp validate_email(user) do
    Regex.match?(~r/#{Application.get_env(:afterglow, :allowed_google_domain)}/, user["email"])
  end

  defp authorize_url!("google") do
    Google.authorize_url!(scope: "email")
  end

  defp create_jwt(user) do
    %{id: user.id, email: user.email, full_name: user.full_name, profile_pic: user.profile_pic}
    |> Authorization.create_token()
  end

  defp authorize_url!(_) do
    raise "No matching provider available"
  end

  defp get_token!("google", code) do
    Google.get_token!(code: code)
  end

  defp get_token!(_, _) do
    raise "No matching provider available"
  end

  defp save_or_update_user(user) do
    saved_user = Repo.one(from(u in User, where: u.email == ^user["email"]))

    if saved_user do
      changeset =
        User.changeset(saved_user, %{
          email: user["email"],
          first_name: user["given_name"],
          last_name: user["family_name"],
          profile_pic: user["picture"],
          metadata: user,
          full_name: user["name"]
        })

      Repo.update_with_cache(changeset)
    else
      changeset =
        User.changeset(%User{}, %{
          email: user["email"],
          first_name: user["given_name"],
          last_name: user["family_name"],
          profile_pic: user["picture"],
          metadata: user,
          full_name: user["name"]
        })

      {:ok, u} = Repo.insert_with_cache(changeset)
      permission_set = Repo.one(from(ps in PermissionSet, where: ps.name == "Viewer"))

      Repo.insert_with_cache(
        UserPermissionSet.changeset(%UserPermissionSet{}, %{
          user_id: u.id,
          permission_set_id: permission_set.id
        })
      )

      {:ok, u}
    end
  end

  defp get_user!("google", token) do
    user = OAuth2.Client.get!(token, "https://www.googleapis.com/plus/v1/people/me/openIdConnect")
    user.body
  end
end
