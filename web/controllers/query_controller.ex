defmodule AfterGlow.QueryController do
  use AfterGlow.Web, :controller
  alias AfterGlow.Database
  import AfterGlow.Sql.QueryRunner
  alias AfterGlow.Plugs.Authorization
  plug(Authorization)
  plug(:authorize!, AfterGlow.Query)
  plug(:verify_authorized)

  def execute(conn, params) do
    db_identifier = params["database"]["unique_identifier"]
    db_record = Repo.one(from(d in Database, where: d.unique_identifier == ^db_identifier))

    {query, results} =
      case params["queryType"] do
        "query_builder" ->
          run_query_from_object(db_record, params)

        "raw" ->
          permit_prms = params
          |> permit_params
          |> permit_prms_raw_query(params["rawQuery"])
          run_raw_query(db_record, permit_prms)
      end

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
