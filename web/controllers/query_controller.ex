defmodule AfterGlow.QueryController do
  use AfterGlow.Web, :controller

  require IEx

  alias AfterGlow.Database
  alias AfterGlow.Sql.DbConnection
  alias AfterGlow.Async
  alias AfterGlow.ColumnValuesTasks
  alias AfterGlow.Variable
  alias AfterGlow.Plugs.Authorization
  plug Authorization
  plug :authorize!, AfterGlow.Query
  plug :verify_authorized


  def execute conn, params do
    db_id = params["database"]["id"]
    db_record = Repo.one(from d in Database, where: d.id == ^db_id)
    {query, results} = case params["queryType"] do
                         "query_builder" ->
                           run_query_from_object(db_record, params)
                         "raw" ->
                           run_raw_query(db_record, params)
                       end
    conn
    |> render "execute.json", data: results, query: query
  end
  
  def get_response do
    
  end

  def completed_query conn, params do
    IEx.pry
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
    table = if params["table"], do: params["table"]["name"], else: nil
    query = replace_variables(params["rawQuery"], params["variables"])
    query_key = generate_query_key(db_record.db_url, query)
    payload = "{\"args\" : [\"#{db_record.db_url}\", \"#{query}\", \"#{query_key}\", 3600]}"
    {:ok, resp} = HTTPoison.post(
      Application.get_env(:afterglow, :worker_url) <> "/api/task/async-apply/query_runner.run",
      payload,
      [{"Content-Type" , "application/json"}],
      [recv_timeout: 100000]
    )
    {:ok, resp} = Poison.decode(resp.body)
    resp = Map.put(resp, "query_key", query_key)
    {params["rawQuery"], resp}
  end

  defp save_column_values results, permit_prms do
    case results do
      {:ok, valid_results} ->
        Async.perform(&ColumnValuesTasks.save/2, [permit_prms[:table]["id"], valid_results])
      _ ->
        "pass"
    end
  end

  defp generate_query_key(db_url, query) do
    :crypto.hash(:sha, db_url <> query) |> Base.encode16 |> String.downcase
  end
  defp replace_variables(query, variables) do
    variables
    |> Enum.reduce(query, fn variable, query ->
      variable_name = variable["name"] |> String.strip()
      value = variable["value"] || ""
      variable = for {key, val} <- variable, into: %{}, do: {String.to_atom(key), val}
      value = Variable.format_value(struct(Variable, variable), value)
      query
      |> String.replace(~r({{.*#{variable_name}.*}}), value)
    end)
  end

end

