defmodule AfterGlow.ApiActionController do
  use AfterGlow.Web, :controller

  alias AfterGlow.ApiActions
  alias AfterGlow.ApiActions.ApiAction

  alias JaSerializer.Params

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)

  action_fallback(AfterGlow.Web.FallbackController)

  def index(conn, %{"filter" => %{"id" => ids}}) do
    ids = ids |> String.split(",") |> Enum.map(fn x -> x |> Integer.parse() |> elem(0) end)
    api_actions = ApiActions.list_api_actions(ids)
    render(conn, "index.json", data: api_actions)
  end

  def create(conn, %{
        "data" => data = %{"type" => "api-actions", "attributes" => _database_params}
      }) do
    prms = Params.to_attributes(data)

    with {:ok, %ApiAction{} = api_action} <- ApiActions.create_api_action(prms) do
      api_action

      conn
      |> put_status(:created)
      |> put_resp_header("location", api_action_path(conn, :show, api_action))
      |> render("show.json-api", data: api_action)
    end
  end

  def show(conn, %{"id" => id}) do
    api_action = ApiActions.get_api_action!(id)
    render(conn, "show.json", data: api_action)
  end

  def update(conn, %{
        "id" => id,
        "data" => data = %{"type" => "api-actions", "attributes" => _database_params}
      }) do
    api_action = ApiActions.get_api_action!(id)
    prms = Params.to_attributes(data)

    with {:ok, %ApiAction{} = api_action} <- ApiActions.update_api_action(api_action, prms) do
      render(conn, "show.json", data: api_action)
    end
  end

  def delete(conn, %{"id" => id}) do
    ApiActions.delete_api_action!(id)
    send_resp(conn, :no_content, "")
  end

  def send_request(conn, params) do
    resp = ApiActions.send_request(params["id"], params["variables"], conn.assigns.current_user)
    json(conn, resp)
  end
end
