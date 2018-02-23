defmodule AfterGlow.Sql.Adapters.Mysql do
  alias AfterGlow.Sql.Adapters.QueryMakers.Mysql, as: QueryMaker
  use Supervisor
  require IEx
  alias DbConnection
  def create_pool(config) do
    Mariaex.start_link(
      hostname: config["host_url"],
      username: config["username"],
      password: config["password"],
      database: config["db_name"],
      port: config["host_port"],
      timeout: 120000,
      connect_timeout: 120000,
      handshake_timeout: 120000,
      ownership_timeout: 120000,
      pool_timeout: 120000,
      pool: DBConnection.Poolboy,
      pool_size: 10,
    )
  end

  def opts do
    [timeout: 120000, pool: DBConnection.Poolboy, pool_timeout: 120000]
  end

  def stream_opts do
    [timeout: 12000000, pool: DBConnection.Poolboy, pool_timeout: 12000000, max_rows: 2000]
  end

  def txn_opts do
    [timeout: 12000000, pool: DBConnection.Poolboy, pool_timeout: 12000000]
  end
  
  def execute_with_stream(pid, query, mapper_fn, options \\ %{})
  def execute_with_stream(pid, query, mapper_fn, options) when is_binary(query)  do
    Mariaex.transaction(pid, fn(conn) ->
      {:ok, query} = Mariaex.prepare(conn, "", query, opts) 
      columns =   query.columns
      rows = Mariaex.stream(conn, query, [], stream_opts)
      |> Stream.map(fn (%Mariaex.Result{rows: rows}) -> rows end)
      mapper_fn.(rows, columns)
    end, txn_opts)
  end
  
  def get_schema(conn) do
    {:ok, data} = Mariaex.query(conn, "select table_name,
    column_name as name, column_type as data_type from information_schema.columns where
    table_schema = DATABASE() order by table_name,ordinal_position",
      [], opts)

    {:ok, data.rows
    |> Enum.map(fn row ->
      Enum.zip(data.columns, row)  |> Map.new
     end)
     |> Enum.group_by(fn x -> x["table_name"] end)
     |> Enum.map(fn {x,y} -> %{"table_name" => x, "columns" => y, "readable_table_name" => x} end)
    }
   

  end

  def query_string query_record do
    QueryMaker.sql(query_record, :mysql)
  end

  def execute(conn, query, options \\ %{})
  def execute(conn, query, options) when is_map(query)  do
    {limited, exec_query} = QueryMaker.sql(query, :mysql)
    |> QueryMaker.limit_rows_in_query(2000)
    query = Mariaex.prepare(conn, "", exec_query, opts)
    case query do
      {:ok, prepared_query} -> 
        {:ok, results} = Mariaex.execute(conn, prepared_query, [], opts) 
        {:ok, %{columns: results.columns, rows: results.rows, limited: limited, limit: 2000, limited_query: exec_query}}
      {:error, error} ->
        {:error, error.mariadb}
    end
  end

  def execute(conn, query, options) when is_binary(query)  do
    {limited, exec_query} = query |> QueryMaker.limit_rows_in_query(2000) 
    query = Mariaex.prepare(conn, "", exec_query|> IO.inspect, opts)
    case query do
      {:ok, prepared_query} -> 
        {:ok, results} = Mariaex.execute(conn, prepared_query, [], opts) 
        {:ok, %{columns: results.columns, rows: results.rows, limited: limited, limit: 2000, limited_query: exec_query}}
        {:error, error} ->
        {:error, error.mariadb}
    end
  end
end
