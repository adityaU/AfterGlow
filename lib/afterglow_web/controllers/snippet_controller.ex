defmodule AfterGlow.SnippetController do
  use AfterGlow.Web, :controller
  @model_type "snippets"
  @model AfterGlow.Snippets.Model
  @query_functions AfterGlow.Snippets.QueryFunctions

  import AfterGlow.Web.ChangesetView, only: [translate_errors: 1]

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)

  plug(:authorize!, @model)
  plug(:verify_authorized)

  action_fallback(AfterGlow.Web.FallbackController)
  use AfterGlow.Utils.Controllers.SimpleCrud

  def index(conn, %{"database_id" => database_id}) do
    json(conn, %{data: @query_functions.find_by_database_id(database_id)})
  end

  def create(conn, params) do
    params = params |> Map.merge(%{"owner_id" => conn.assigns.current_user.id})

    case @query_functions.create(params) do
      {:ok, snippet} ->
        json(conn, %{data: snippet})

      {:error, error} ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: translate_errors(error)})
    end
  end

  def find_referenced_by(conn, %{"id" => id}) do
    json(conn, %{data: @query_functions.find_referenced_by(id)})
  end
end
