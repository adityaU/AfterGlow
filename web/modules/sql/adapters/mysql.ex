defmodule AfterGlow.Sql.Adapters.Mysql do
  import AfterGlow.Sql.Adapters.QueryMakers.Mysql
  import AfterGlow.Utils.Integer
  use Supervisor
  alias DbConnection

  def create_pool(config) do
    pool_size =
      config["pool_size"]
      |> parse_integer
      |> Kernel.||(10)

    checkout_timeout =
      config["checkout_timeout"]
      |> parse_integer
      |> Kernel.||(45)
      |> Kernel.*(1000)
      |> Kernel./(3)
      |> floor

    query_timeout =
      config["query_timeout"]
      |> parse_integer
      |> Kernel.||(2)
      |> Kernel.*(120_000)

    {:ok,
     %{
       query_options: [timeout: query_timeout],
       conn:
         MyXQL.start_link(
           hostname: config["host_url"],
           username: config["username"],
           password: config["password"],
           database: config["db_name"],
           port: config["host_port"],
           timeout: 15_0000,
           queue_target: checkout_timeout,
           queue_interval: checkout_timeout,
           pool: DBConnection.ConnectionPool,
           pool_size: pool_size,
           types: AfterGlow.MyXQLTypes
         )
         |> elem(1)
     }}
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
    {:ok, result} =
      MyXQL.query(
        conn.conn,
        ~s/SELECT
    TABLE_NAME as 'table_name',
    COLUMN_NAME as 'column_name',
    CONSTRAINT_NAME as 'name',
    REFERENCED_TABLE_NAME as 'foreign_table_name',REFERENCED_COLUMN_NAME as 'foreign_column_name'
  FROM
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
  WHERE
  REFERENCED_TABLE_SCHEMA = DATABASE()/,
        [],
        conn.query_options
      )

    result.rows
    |> Enum.map(fn row ->
      Enum.zip(result.columns, row) |> Map.new()
    end)
  end

  def get_primary_keys(conn) do
    {:ok, result} = MyXQL.query(conn.conn, ~s/SELECT
   table_name as table_name,
   column_name as column_name
FROM
   information_schema.columns
WHERE
   column_key = 'PRI'

   and table_schema = DATABASE()/, [], conn.query_options)

    result.rows
    |> Enum.map(fn row ->
      Enum.zip(result.columns, row) |> Map.new()
    end)
  end

  def get_schema(conn) do
    {:ok, data} =
      MyXQL.query(conn.conn, "select table_name as table_name, table_name as readable_table_name,
    column_name as name, column_type as data_type from information_schema.columns where
    table_schema = DATABASE() order by table_name,ordinal_position", [], conn.query_options)

    {:ok,
     data.rows
     |> Enum.map(fn row ->
       Enum.zip(data.columns, row) |> Map.new()
     end)
     |> Enum.group_by(fn x -> x["table_name"] end)
     |> Enum.map(fn {x, y} -> %{"table_name" => x, "columns" => y, "readable_table_name" => x} end)}
  end

  def query_string(query_record) do
    sql(query_record, :mysql)
  end

  def make_dependency_raw_query(column, foreign_column, table, value, value_column, primary_keys) do
    query = "SELECT #{table.name}.* FROM #{table.name}
    INNER JOIN #{value_column.table.name}
    ON #{column.table.name}.\"#{column.name}\" = #{foreign_column.table.name}.\"#{foreign_column.name}\"
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
      sql(query, :mysql)
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
    query =
      if download_limit do
        {_limited, query} =
          query
          |> limit_rows_in_query(download_limit)

        query
      else
        query
      end

    MyXQL.transaction(
      pid.conn,
      fn conn ->
        {:ok, query} = MyXQL.prepare(conn, "", query, pid.query_options)
        columns = query.columns

        rows =
          MyXQL.stream(conn, query, [], stream_opts())
          |> Stream.map(fn %MyXQL.Result{rows: rows} -> rows end)

        mapper_fn.(rows, columns)
      end,
      txn_opts()
    )
  end

  defp run_query(conn, _query, exec_query, limited, frontend_limit) do
    try do
      query = MyXQL.prepare(conn.conn, "", exec_query, conn.query_options)

      case query do
        {:ok, prepared_query} ->
          {:ok, _, results} = MyXQL.execute(conn.conn, prepared_query, [], conn.query_options)

          {:ok,
           %{
             columns: results.columns,
             rows: results.rows,
             limited: limited,
             limit: frontend_limit,
             limited_query: exec_query
           }}

        {:error, e = %DBConnection.ConnectionError{}} ->
          {:error, %{message: e.message}}

        {:error, error} ->
          {:error, %{message: error.message}}
      end
    rescue
      e ->
        {:error, %{message: e.message}}
    end
  end
end
