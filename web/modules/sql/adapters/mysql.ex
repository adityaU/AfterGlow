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
      timeout: 1_200_000,
      connect_timeout: 1_200_000,
      handshake_timeout: 1_200_000,
      ownership_timeout: 1_200_000,
      pool_timeout: 1_200_000,
      pool: DBConnection.Poolboy,
      pool_size: 10
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

  def execute_with_stream(pid, query, mapper_fn, options \\ %{})

  def execute_with_stream(pid, query, mapper_fn, _options) when is_binary(query) do
    Mariaex.transaction(
      pid,
      fn conn ->
        {:ok, query} = Mariaex.prepare(conn, "", query, opts())

        rows_and_columns =
          Mariaex.stream(conn, query, [], stream_opts())
          |> Stream.map(fn %Mariaex.Result{rows: rows, columns: columns} ->
            [rows, columns]
          end)

        rows = rows_and_columns |> Stream.map(fn x -> x |> Enum.at(0) end)
        columns = rows_and_columns |> Stream.map(fn x -> x |> Enum.at(1) end) |> Enum.at(0)
        mapper_fn.(rows, columns)
      end,
      txn_opts()
    )
  end

  def get_fkeys(conn) do
    {:ok, result} = Mariaex.query(conn, ~s/SELECT
    TABLE_NAME as 'table_name',
    COLUMN_NAME as 'column_name',
    CONSTRAINT_NAME as 'name',
    REFERENCED_TABLE_NAME as 'foreign_table_name',REFERENCED_COLUMN_NAME as 'foreign_column_name'
  FROM
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
  WHERE
  REFERENCED_TABLE_SCHEMA = DATABASE()/, [], opts())

    result.rows
    |> Enum.map(fn row ->
      Enum.zip(result.columns, row) |> Map.new()
    end)
  end

  def get_primary_keys(conn) do
    {:ok, result} = Mariaex.query(conn, ~s/SELECT
   table_name,
   column_name

FROM
   information_schema.columns
WHERE
   column_key = 'PRI'
   and table_schema = DATABASE()/, [], opts())

    result.rows
    |> Enum.map(fn row ->
      Enum.zip(result.columns, row) |> Map.new()
    end)
  end

  def get_schema(conn) do
    {:ok, data} = Mariaex.query(conn, "select table_name,
    column_name as name, column_type as data_type from information_schema.columns where
    table_schema = DATABASE() order by table_name,ordinal_position", [], opts)

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

  def execute(conn, query, options \\ %{})

  def execute(conn, query, options) when is_map(query) do
    {limited, exec_query} =
      QueryMaker.sql(query, :mysql)
      |> QueryMaker.limit_rows_in_query(2000)

    query = Mariaex.prepare(conn, "", exec_query, opts)

    case query do
      {:ok, prepared_query} ->
        {:ok, results} = Mariaex.execute(conn, prepared_query, [], opts)

        {:ok,
         %{
           columns: results.columns,
           rows: results.rows,
           limited: limited,
           limit: 2000,
           limited_query: exec_query
         }}

      {:error, error} ->
        {:error, error.mariadb}
    end
  end

  def execute(conn, query, options) when is_binary(query) do
    {limited, exec_query} = query |> QueryMaker.limit_rows_in_query(2000)
    query = Mariaex.prepare(conn, "", exec_query, opts)

    case query do
      {:ok, prepared_query} ->
        {:ok, results} = Mariaex.execute(conn, prepared_query, [], opts)

        {:ok,
         %{
           columns: results.columns,
           rows: results.rows,
           limited: limited,
           limit: 2000,
           limited_query: exec_query
         }}

      {:error, error} ->
        {:error, error.mariadb}
    end
  end
end
