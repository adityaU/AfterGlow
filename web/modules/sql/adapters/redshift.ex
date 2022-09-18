defmodule AfterGlow.Sql.Adapters.Redshift do
  alias AfterGlow.Sql.Adapters.QueryMakers.Redshift, as: QueryMaker
  use Supervisor
  alias DbConnection

  alias AfterGlow.ODBC

  def create_pool(config) do
    connection_string =
      'Driver={Redshift};Server=#{config["host_url"]};Port=#{config["host_port"]};Database=#{
        config["db_name"]
      };Uid=#{config["username"]};Pwd=#{config["password"]}' 

    DBConnection.start_link(AfterGlow.ODBC.Protocol,
      conn_str: connection_string,
      pool: DBConnection.ConnectionPool,
      pool_size: 10,
    )
  end

  def opts do
    [timeout: 1_200_000, pool: DBConnection.Poolboy, pool_timeout: 120_000]
  end

  def stream_opts do
    [timeout: 12_000_000, pool: DBConnection.Poolboy, pool_timeout: 12_000_000, max_rows: 2000]
  end

  def txn_opts do
    [timeout: 12_000_000, pool: DBConnection.Poolboy, pool_timeout: 12_000_000]
  end

  def get_fkeys(conn) do
    {:ok,_,  result} = DBConnection.execute(conn,%ODBC.Query{statement: ~s/SELECT
    CONCAT('\"\', tc.table_schema,\'\".\"\', tc.table_name, \'\"\') as table_name,
    CONCAT('\"\', ccu.table_schema,\'\".\"\', ccu.table_name, \'\"\') as foreign_table_name,
    tc.constraint_name as name,
    kcu.column_name,
    ccu.column_name AS foreign_column_name
FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE constraint_type = 'FOREIGN KEY'/}, [])

    result.rows
    |> Enum.map(fn row ->
      Enum.zip(result.columns, row) |> Map.new()
    end)
  end

  def get_primary_keys(conn) do
    {:ok,_, result} =
      DBConnection.execute(
        conn,
        %ODBC.Query{statement: ~s/SELECT
        pg_attribute.attname as column_name, '"' + nspname + '"."' +  pg_class.relname + '"' as table_name
      FROM pg_index, pg_class, pg_attribute, pg_namespace
      WHERE
        indrelid = pg_class.oid AND
        pg_class.relnamespace = pg_namespace.oid AND
        pg_attribute.attrelid = pg_class.oid AND
        pg_attribute.attnum =  ANY(string_to_array(textin(int2vectorout(pg_index.indkey)), ' '))
        and nspname not in ('information_schema', 'pg_catalog', 'pg_toast')
       AND indisprimary/},
        []
      )

    result.rows
    |> Enum.map(fn row ->
      Enum.zip(result.columns, row) |> Map.new()
    end)
  end

  def get_schema(conn) do
    {:ok, _, data} =
      DBConnection.execute(
        conn,
        %ODBC.Query{statement: ~s/select '"' + table_schema + '"."' + table_name + '"' as table_name
        , column_name name, data_type
        from information_schema.columns where table_schema not in ('information_schema', 'pg_catalog')
        order by ordinal_position/},
        []
      )

    {:ok,
     data.rows
     |> Enum.map(fn row ->
       Enum.zip(data.columns, row) |> Map.new()
     end)
     |> Enum.group_by(fn x -> x["table_name"] end)
     |> Enum.map(fn {x, y} -> %{"table_name" => x, "columns" => y, "readable_table_name" => x} end)}
  end

  def query_string(query_record) do
    QueryMaker.sql(query_record, :postgres)
  end

  def make_dependency_raw_query(column, foreign_column, table, value, value_column) do
    "SELECT #{table.name}.* FROM #{table.name}
    INNER JOIN #{value_column.table.name}
    ON #{column.table.name}.\"#{column.name}\" = #{foreign_column.table.name}.\"#{
      foreign_column.name
    }\"
    WHERE #{value_column.table.name}.\"#{value_column.name}\" = '#{value}'"
  end

  def execute(conn, query, frontned_limit, options \\ %{})

  def execute(conn, query, frontend_limit, options) when is_map(query) do
    {limited, exec_query} =
      QueryMaker.sql(query, :postgres)
      |> QueryMaker.limit_rows_in_query(frontend_limit)

    run_query(conn, query, exec_query, limited, frontend_limit)
  end

  def execute(conn, query, frontend_limit, options) when is_binary(query) do
    {limited, exec_query} = query |> QueryMaker.limit_rows_in_query(2000)
    run_query(conn, query, exec_query, limited, frontend_limit)
  end

  def execute_with_stream(pid, query, download_limit, mapper_fn, options \\ %{})

  def execute_with_stream(pid, query, download_limit, mapper_fn, options) when is_binary(query) do
    query =
      if download_limit do
        {_limited, query} =
          query
          |> QueryMaker.limit_rows_in_query(download_limit)

        query
      else
        query
      end

    {:ok, _ , results } = DBConnection.execute(pid, %ODBC.Query{statement: query}, []) 
    mapper_fn.(results.rows , results.columns)

  end

  defp run_query(conn, query, exec_query, limited, frontend_limit) do
    case DBConnection.execute(conn, %ODBC.Query{statement: exec_query}, []) do
      {:ok, _, results} ->
        {:ok,
         %{
           columns: results.columns,
           rows: results.rows,
           limited: limited,
           limit: frontend_limit,
           limited_query: exec_query,
           num_rows: results.num_rows
         }}

      {:error, %DBConnection.ConnectionError{}} ->
        {:error, %{message: "database connection timed out"}}

      {:error, error} ->
        {:error, %{message: error.message}}
    end
  end
end
