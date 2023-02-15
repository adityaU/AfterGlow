defmodule AfterGlow.NewUserController do
  use AfterGlow.Web, :controller
  @model_type "users"
  @model AfterGlow.User
  @query_functions AfterGlow.Users.QueryFunctions

  alias AfterGlow.Users.QueryFunctions, as: Users
  alias AfterGlow.Plugs.Authorization
  alias AfterGlow.User.Policy, as: UserPolicy
  plug(Authorization)

  plug(:authorize!, @model)
  plug(:verify_authorized)
  # plug(:authorize!, Team)
  # plug(:verify_authorized)

  action_fallback(AfterGlow.Web.FallbackController)
  use AfterGlow.Utils.Controllers.Crud

  def create_bulk(conn, %{"emails" => emails, "ps_id" => ps_id}) do
    users = Users.create_bulk(emails, ps_id)
    json(conn,  %{users: users})
  end

end
