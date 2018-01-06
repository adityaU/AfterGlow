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
    query = QueryMaker.sql(query, :mysql)
    query = Mariaex.prepare(conn, "", query, opts)
    case query do
      {:ok, prepared_query} -> 
        {:ok, results} = Mariaex.execute(conn, prepared_query, [], opts) 
        {:ok, %{columns: results.columns, rows: results.rows}}
      {:error, error} ->
        {:error, error.mariadb}
    end
  end

  def execute(conn, query, options) when is_binary(query)  do
    query = Mariaex.prepare(conn, "", query, opts)
    case query do
      {:ok, prepared_query} -> 
        {:ok, results} = Mariaex.execute(conn, prepared_query, [], opts) 
        {:ok, %{columns: results.columns, rows: results.rows}}
        {:error, error} ->
        {:error, error.mariadb}
    end
  end
end
