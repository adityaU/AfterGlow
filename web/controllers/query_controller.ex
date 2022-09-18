defmodule AfterGlow.QueryController do
  use AfterGlow.Web, :controller
  alias AfterGlow.Database
  import AfterGlow.Sql.QueryRunner
  alias AfterGlow.Plugs.Authorization
  alias AfterGlow.Settings.ApplicableSettings
  plug(Authorization)
  plug(:authorize!, AfterGlow.Query)
  plug(:verify_authorized)

  def execute(conn, params) do
    {query, results} = run(params, conn.assigns.current_user)

    case results do
      {:ok, results} ->
        conn
        |> render("execute.json", data: results, query: query)

      {:error, error} ->
        conn
        |> put_status(422)
        |> render("execute.json", error: error, query: query)
    end
  end
end
