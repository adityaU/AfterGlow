defmodule AfterGlow.Sql.Adapters.Postgres do
  use AfterGlow.Sql.Adapters.QueryMakers.Common
  use Supervisor
  alias DbConnection
  alias AfterGlow.ODBC

  def create_pool(config) do
    connection_string =
      'Driver={Postgresql Unicode};Server=#{config["host_url"]};Port=#{config["host_port"]};Database=#{
        config["db_name"]
      };Uid=#{config["username"]};Pwd=#{config["password"]};ConnSettings=set client_encoding=UTF8;'
     

    DBConnection.start_link(AfterGlow.ODBC.Protocol,
      conn_str: connection_string,
      pool: DBConnection.ConnectionPool,
      pool_size: 10,
      show_sensitive_data_on_connection_error: true
    )
  end

  def opts do
    [timeout: 172800000, pool: DBConnection.Poolboy, pool_timeout: 1_200_000]
  end

  def stream_opts do
    [timeout: 12_000_000, pool: DBConnection.Poolboy, pool_timeout: 12_000_000, max_rows: 2000]
  end

  def txn_opts do
    [timeout: 12_000_000, pool: DBConnection.Poolboy, pool_timeout: 12_000_000]
  end

  def get_fkeys(conn) do
    {:ok, _, result} = DBConnection.execute(conn, %ODBC.Query{statement: ~s/SELECT conname as name
    ,concat('"', n.nspname, '"."', conrelid::regclass::text, '"') AS "table_name"
    ,CASE WHEN pg_get_constraintdef(c.oid) LIKE 'FOREIGN KEY %' THEN substring(pg_get_constraintdef(c.oid), 14, position(')' in pg_get_constraintdef(c.oid))-14) END AS "column_name"
    ,concat('"', n.nspname, '"."', CASE WHEN pg_get_constraintdef(c.oid) LIKE 'FOREIGN KEY %' THEN substring(pg_get_constraintdef(c.oid), position(' REFERENCES ' in pg_get_constraintdef(c.oid))+12, position('(' in substring(pg_get_constraintdef(c.oid), 14))-position(' REFERENCES ' in pg_get_constraintdef(c.oid))+1) END, '"') AS "foreign_table_name"
    ,CASE WHEN pg_get_constraintdef(c.oid) LIKE 'FOREIGN KEY %' THEN substring(pg_get_constraintdef(c.oid), position('(' in substring(pg_get_constraintdef(c.oid), 14))+14, position(')' in substring(pg_get_constraintdef(c.oid), position('(' in substring(pg_get_constraintdef(c.oid), 14))+14))-1) END AS "foreign_column_name"
FROM   pg_constraint c
JOIN   pg_namespace n ON n.oid = c.connamespace
WHERE  contype IN ('f')
AND pg_get_constraintdef(c.oid) LIKE 'FOREIGN KEY %'
ORDER  BY pg_get_constraintdef(c.oid), conrelid::regclass::text, contype DESC/}, [], opts())

    result.rows
    |> Enum.map(fn row ->
      Enum.zip(result.columns, row) |> Map.new()
    end)
  end

  def get_primary_keys(conn) do
    {:ok, _, result} = DBConnection.execute(conn, %ODBC.Query{statement: ~s/SELECT
    pg_attribute.attname as column_name, concat('"', nspname, '"."',  pg_class.relname, '"') as table_name
  FROM pg_index, pg_class, pg_attribute, pg_namespace
  WHERE
    indrelid = pg_class.oid AND
    nspname = 'public' AND
    pg_class.relnamespace = pg_namespace.oid AND
    pg_attribute.attrelid = pg_class.oid AND
    pg_attribute.attnum = any(pg_index.indkey)
   AND indisprimary/}, [], opts())

    result.rows
    |> Enum.map(fn row ->
      Enum.zip(result.columns, row) |> Map.new()
    end)
  end

  def get_schema(conn) do
    {:ok, _, data} = DBConnection.execute(conn, %ODBC.Query{statement: ~s/select
      table_catalog,
      CONCAT('\"\', table_schema,\'\".\"\', table_name, \'\"\') as table_name,
      table_name as readable_table_name,
      table_schema,
      json_agg((select x from (select cast(column_name as text) as "name", cast(data_type as text) as "data_type") x)) as columns
      from information_schema.columns
      where information_schema.columns.table_schema not in ('information_schema', 'pg_catalog')
        group by table_catalog,table_schema, table_name/}, [], opts())

    {:ok,
     data.rows
     |> Enum.map(fn row ->
       Enum.zip(data.columns, row) |> Map.new()
     end)}
  end

  def query_string(query_record) do
    sql(query_record, :postgres)
  end

  def make_dependency_raw_query(column, foreign_column, table, value, value_column, primary_keys) do
    query =
      "SELECT #{table.name}.* FROM #{table.name}
    INNER JOIN #{value_column.table.name}
    ON #{column.table.name}.\"#{column.name}\" = #{foreign_column.table.name}.\"#{
        foreign_column.name
      }\"
    WHERE #{value_column.table.name}.\"#{value_column.name}\" = '#{value}'"

    if primary_keys |> length > 0 do
      query <>
        " GROUP BY " <>
        (primary_keys
         |> Enum.map(fn pk -> "#{table.name}.\"#{pk.name}\"" end)
         |> Enum.join(", "))
    else
      query
    end
  end

  def execute(conn, query, frontend_limit, options \\ %{})

  def execute(conn, query, frontend_limit, _options) when is_map(query) do
    {limited, exec_query} =
      sql(query, :postgres)
      |> limit_rows_in_query(frontend_limit)

    run_query(conn, query, exec_query, limited, frontend_limit)
  end

  def execute(conn, query, frontend_limit, _options) when is_binary(query) do
    {limited, exec_query} =
      query
      |> limit_rows_in_query(frontend_limit)

    run_query(conn, query, exec_query, limited, frontend_limit)
  end

  def execute_with_stream(pid, query, download_limit, mapper_fn, options \\ %{})

  def execute_with_stream(pid, query, download_limit, mapper_fn, _options)
      when is_binary(query) do
    {limited, query} =
      if download_limit do
        query
        |> limit_rows_in_query(download_limit)
      else
        {false, query}
      end

    case run_query(pid, query, query, limited, download_limit) do
      {:ok, results} ->
        mapper_fn.(results.rows, results.columns)

      {:error, error} ->
        error 
    end
  end

  defp run_query(conn, _query, exec_query, limited, frontend_limit) do
    wrapped_query = "select json_agg(raw_data) as data from (#{exec_query}) as raw_data"

    only_column_names_query =
      "select * from (#{exec_query} ) as zero_query limit 0"

    response =
      DBConnection.execute(conn, %ODBC.Query{statement: only_column_names_query}, [])

    case response do
      {:ok, _, results} ->
        columns = results.columns

        case DBConnection.execute(conn, %ODBC.Query{statement: wrapped_query}, [], opts()) do
          {:ok, _, results} ->
            rows =
              results.rows
              |> Enum.at(0) 
              |> Enum.at(0)
            
            rows = if rows &&  rows |> length >= 1 do
              rows
              |> Enum.map(fn x -> columns |> Enum.map(fn y -> x[y] end) end)
              else
              []
              end

            {:ok,
             %{
               columns: columns,
               rows: rows,
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

      {:error, %DBConnection.ConnectionError{}} ->
        {:error, %{message: "database connection timed out"}}

      {:error, error} ->
        {:error, %{message: error.message}}

      error ->
        error 
    end
  end
end
