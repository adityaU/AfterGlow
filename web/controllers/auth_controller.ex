defmodule AfterGlow.AuthController do
  use AfterGlow.Web, :controller
  alias Mix.Tasks.Hex.Organization
  alias AfterGlow.Oauth.Google
  alias AfterGlow.User
  alias AfterGlow.Permission
  alias AfterGlow.UserPermissionSet
  alias AfterGlow.PermissionSet
  alias AfterGlow.Plugs.Authorization
  alias AfterGlow.CacheWrapper
  alias AfterGlow.CacheWrapper.Repo
  alias AfterGlow.Settings.ApplicableSettings
  alias AfterGlow.Repo
  import Ecto.Query, only: [from: 2]

  import AfterGlow.Utils.DomainChecks

  def google_auth_path(conn, _params) do
    conn
    |> json(%{path: authorize_url!("google")})
  end

  def login_with_password(conn, %{"email" => email, "password" => password}) do
    hashed_password = User.encrypt(password)

    user =
      Repo.one(
        from(u in User,
          where: u.email == ^email and u.password == ^hashed_password
        )
      )

    if user do
      perm =
        user
        |> Repo.preload(permission_sets: :permissions)
        |> permissions

      auth_token = create_jwt(user)

      conn
      |> json(%{
        token: auth_token,
        success: true,
        user: %{id: user.id, full_name: user.full_name, email: user.email},
        permissions: perm
      })
    else
      conn
      |> put_status(:unauthorized)
      |> json(%{success: false})
    end
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
    perms =
      user.permission_sets
      |> Enum.map(fn x -> x.permissions |> Enum.map(fn y -> y.name end) end)
      |> List.flatten()

    if ApplicableSettings.can_download_reports(user) == "true" do
      perms ++ ["Download.enabled"]
    else
      perms
    end
  end

  def callback(conn, %{"provider" => provider, "code" => code}) do
    code = URI.decode(code)
    token = get_token!(provider, code)
    user = get_user!(provider, token)

    case match_domain(user["emailAddresses"] |> Enum.at(0) |> Access.get("value")) do
      true ->
        {:ok, user} = User.save_or_update_user(user)
        if user.is_deactivated do 

          conn
          |> put_status(:unprocessable_entity)
          |> json(%{
            error: "Your account has been deactivated. Please contact admins."
          })
        else
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
        end


      false ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{
          error: "Your organization is not allowed to access this page" 
        })
    end
  end

  defp authorize_url!("google") do
    Google.authorize_url!(
      scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"
    )
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

  defp get_user!("google", token) do
    user =
      OAuth2.Client.get!(
        token,
        "https://people.googleapis.com/v1/people/me?personFields=emailAddresses,names"
      )

    user.body
  end
end
