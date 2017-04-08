require IEx
defmodule AfterGlow.Sql.Adapters.Postgres do
  use AfterGlow.Sql.Adapters.QueryMakers.Common
  use Supervisor
  alias DbConnection
  def create_pool(config) do
    Postgrex.start_link(
      hostname: config["host_url"],
      username: config["username"],
      password: config["password"],
      database: config["db_name"],
      port: config["port"],
      timeout: 120000,
      connect_timeout: 120000,
      handshake_timeout: 120000,
      ownership_timeout: 120000,
      pool_timeout: 120000,
      pool: DBConnection.Poolboy,
      pool_size: 10,
      types: AfterGlow.PostgrexTypes
    )
  end

  def opts do
    [timeout: 120000, pool: DBConnection.Poolboy, pool_timeout: 120000]
  end

  def get_schema(conn) do
    {:ok, data} = Postgrex.query(conn, ~s/select
      table_catalog,
      CONCAT('\"\', table_schema,\'\".\"\', table_name, \'\"\') as table_name,
      table_name as readable_table_name,
      table_schema,
      json_agg((select x from (select cast(column_name as text) as "name", cast(data_type as text) as "data_type") x)) as columns
      from information_schema.columns where table_schema = \'public'
        group by table_catalog,table_schema, table_name/,[])

    {:ok, data.rows
    |> Enum.map(fn row ->
      Enum.zip(data.columns, row)  |> Map.new
    end)}
   

  end

  def query_string query_record do
    sql(query_record, :postgres)
  end

  def execute(conn, query, options \\ %{})
  def execute(conn, query, options) when is_map(query)  do
    query = sql(query, :postgres)
    query = Postgrex.prepare(conn, "", query, opts)
    case query do
      {:ok, prepared_query} -> 
        Postgrex.execute(conn, prepared_query, [], opts) 
      {:error, error} ->
        {:error, error.postgres}
    end
  end

  def execute(conn, query, options) when is_binary(query)  do
    query = Postgrex.prepare(conn, "", query, opts)
    case query do
      {:ok, prepared_query} -> 
        Postgrex.execute(conn, prepared_query, [], opts) 
        {:error, error} ->
        {:error, error.postgres}
    end
  end
end
