defmodule AfterGlow.QueryController do
  use AfterGlow.Web, :controller
  alias AfterGlow.Database
  alias AfterGlow.Sql.DbConnection
  alias AfterGlow.Async
  alias AfterGlow.ColumnValuesTasks
  
  alias AfterGlow.Plugs.Authorization
  plug Authorization
  plug :authorize!, AfterGlow.Query
  plug :verify_authorized


  def execute conn, params do
    db_identifier = params["database"]["unique_identifier"]
    db_record = Repo.one(from d in Database, where: d.unique_identifier == ^db_identifier)
    {query, results} = case params["queryType"] do
                         "query_builder" ->
                           run_query_from_object(db_record, params)
                         "raw" ->
                           run_raw_query(db_record, params)
                       end
    case results do
      {:ok, results} ->
        conn
        |> render "execute.json", data: results, query: query
      {:error, error} ->
        conn
        |> put_status(422)
        |> render "execute.json", error: error, query: query
    end
  end

  defp permit_params params do
    %{
      database:  params["database"],
      table:     params["table"],
      selects:   params["views"]|> Enum.map(fn x-> x["selected"] end),
      group_bys: params["groupBys"] |> Enum.map(fn x-> [x["selected"], x["castType"]["value"]] end),
      filters:   params["filters"],
      order_bys: params["orderBys"],
      limit:     params["limit"],
      offset:    params["offset"]
    }
  end

  defp run_query_from_object db_record, params do
    permit_prms = permit_params(params) 
    query = DbConnection.query_string(db_record |> Map.from_struct, permit_prms )
    results = DbConnection.execute(db_record |> Map.from_struct, permit_prms )
    save_column_values results, permit_prms
    {query, results}
  end

  defp run_raw_query db_record, params do
    query = params["rawQuery"]
    results = DbConnection.execute(db_record |> Map.from_struct, query) 
    {query, results}
  end
  defp save_column_values results, permit_prms do
    case results do
      {:ok, valid_results} ->
        Async.perform(&ColumnValuesTasks.save/2, [permit_prms[:table]["id"], valid_results])
      _ ->
        "pass"
    end
  end
end
