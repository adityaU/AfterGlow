defmodule AfterGlow.Sql.Adapters.Mysql do
  alias AfterGlow.Sql.Adapters.QueryMakers.Mysql, as: QueryMaker
  use Supervisor
  alias DbConnection
  alias AfterGlow.ODBC

  def create_pool(config) do
    connection_string =
      'Driver={Mysql};Server=#{config["host_url"]};Port=#{config["host_port"]};Database=#{
        config["db_name"]
      };Uid=#{config["username"]};Pwd=#{config["password"]}'

    DBConnection.start_link(AfterGlow.ODBC.Protocol,
      conn_str: connection_string,
      pool: DBConnection.ConnectionPool,
      pool_size: 10,
      show_sensitive_data_on_connection_error: true
    )
  end

  def opts do
    [timeout: 1_200_000, pool: DBConnection.Poolboy, pool_timeout: 1_200_000]
  end

  def stream_opts do
    [timeout: 12_000_000, pool: DBConnection.Poolboy, pool_timeout: 12_000_000, max_rows: 2000]
  end

  def txn_opts do
    [timeout: 12_000_000, pool: DBConnection.Poolboy, pool_timeout: 12_000_000]
  end

  def get_fkeys(conn) do
    {:ok, _, result} = DBConnection.execute(conn, %ODBC.Query{statement: ~s/SELECT
    TABLE_NAME as 'table_name',
    COLUMN_NAME as 'column_name',
    CONSTRAINT_NAME as 'name',
    REFERENCED_TABLE_NAME as 'foreign_table_name',REFERENCED_COLUMN_NAME as 'foreign_column_name'
  FROM
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
  WHERE
  REFERENCED_TABLE_SCHEMA = DATABASE()/}, [])

    result.rows
    |> Enum.map(fn row ->
      Enum.zip(result.columns, row) |> Map.new()
    end)
  end

  def get_primary_keys(conn) do
    {:ok, _, result} = DBConnection.execute(conn, %ODBC.Query{statement: ~s/SELECT
   table_name as table_name,
   column_name as column_name

FROM
   information_schema.columns
WHERE
   column_key = 'PRI'
   and table_schema = DATABASE()/}, [])

    result.rows
    |> Enum.map(fn row ->
      Enum.zip(result.columns, row) |> Map.new()
    end)
  end

  def get_schema(conn) do
    {:ok, _, data} =
      DBConnection.execute(conn, %ODBC.Query{statement: "select table_name as table_name,
    column_name as name, column_type as data_type from information_schema.columns where
    table_schema = DATABASE() order by table_name,ordinal_position"}, [])

    {:ok,
     data.rows
     |> Enum.map(fn row ->
       Enum.zip(data.columns, row) |> Map.new()
     end)
     |> Enum.group_by(fn x -> x["table_name"] end)
     |> Enum.map(fn {x, y} -> %{"table_name" => x, "columns" => y, "readable_table_name" => x} end)}
  end

  def query_string(query_record) do
    QueryMaker.sql(query_record, :mysql)
  end

  def make_dependency_raw_query(column, foreign_column, table, value, value_column, primary_keys) do
    query =
      "SELECT `#{table.name}`.* FROM `#{table.name}`
    INNER JOIN `#{value_column.table.name}`
    ON `#{column.table.name}`.`#{column.name}` = `#{foreign_column.table.name}`.`#{
        foreign_column.name
      }`
    WHERE `#{value_column.table.name}`.`#{value_column.name}` = '#{value}'"

    if primary_keys |> length > 0 do
      query <>
        " GROUP BY " <>
        (primary_keys
         |> Enum.map(fn pk -> "`#{table.name}`.`#{pk.name}`" end)
         |> Enum.join(", "))
    else
      query
    end
  end

  def execute(conn, query, frontend_limit, options \\ %{})

  def execute(conn, query, frontend_limit, _options) when is_map(query) do
    {limited, exec_query} =
      QueryMaker.sql(query, :mysql)
      |> QueryMaker.limit_rows_in_query(frontend_limit)

    run_query(conn, query, exec_query, limited, frontend_limit)
  end

  def execute(conn, query, frontend_limit, _options) when is_binary(query) do
    {limited, exec_query} =
      query
      |> QueryMaker.limit_rows_in_query(frontend_limit)

    run_query(conn, query, exec_query, limited, frontend_limit)
  end

  def execute_with_stream(pid, query, download_limit, mapper_fn, options \\ %{})

  def execute_with_stream(pid, query, download_limit, mapper_fn, _options)
      when is_binary(query) do
    query =
      if download_limit do
        {_limited, query} =
          query
          |> QueryMaker.limit_rows_in_query(download_limit)

        query
      else
        query
      end

    {:ok, _, results} = DBConnection.execute(pid, %ODBC.Query{statement: query}, [])
    mapper_fn.(results.rows, results.columns)
  end

  defp run_query(conn, _query, exec_query, limited, frontend_limit) do
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
        {:error, error}
    end
  end
end
