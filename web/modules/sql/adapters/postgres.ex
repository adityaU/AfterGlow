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
      port: config["host_port"],
      timeout: 1_200_000,
      connect_timeout: 1_200_000,
      handshake_timeout: 1_200_000,
      ownership_timeout: 1_200_000,
      pool_timeout: 1_200_000,
      pool: DBConnection.Poolboy,
      pool_size: 10,
      types: AfterGlow.PostgrexTypes
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
    {:ok, result} = Postgrex.query(conn, ~s/SELECT conname as name
    ,concat('"', n.nspname, '"."', conrelid::regclass::text, '"') AS "table_name"
    ,CASE WHEN pg_get_constraintdef(c.oid) LIKE 'FOREIGN KEY %' THEN substring(pg_get_constraintdef(c.oid), 14, position(')' in pg_get_constraintdef(c.oid))-14) END AS "column_name"
    ,concat('"', n.nspname, '"."', CASE WHEN pg_get_constraintdef(c.oid) LIKE 'FOREIGN KEY %' THEN substring(pg_get_constraintdef(c.oid), position(' REFERENCES ' in pg_get_constraintdef(c.oid))+12, position('(' in substring(pg_get_constraintdef(c.oid), 14))-position(' REFERENCES ' in pg_get_constraintdef(c.oid))+1) END, '"') AS "foreign_table_name"
    ,CASE WHEN pg_get_constraintdef(c.oid) LIKE 'FOREIGN KEY %' THEN substring(pg_get_constraintdef(c.oid), position('(' in substring(pg_get_constraintdef(c.oid), 14))+14, position(')' in substring(pg_get_constraintdef(c.oid), position('(' in substring(pg_get_constraintdef(c.oid), 14))+14))-1) END AS "foreign_column_name"
FROM   pg_constraint c
JOIN   pg_namespace n ON n.oid = c.connamespace
WHERE  contype IN ('f')
AND pg_get_constraintdef(c.oid) LIKE 'FOREIGN KEY %'
ORDER  BY pg_get_constraintdef(c.oid), conrelid::regclass::text, contype DESC/, [], opts())

    result.rows
    |> Enum.map(fn row ->
      Enum.zip(result.columns, row) |> Map.new()
    end)
  end

  def get_primary_keys(conn) do
    {:ok, result} = Postgrex.query(conn, ~s/SELECT
    pg_attribute.attname as column_name, concat('"', nspname, '"."',  pg_class.relname, '"') as table_name
  FROM pg_index, pg_class, pg_attribute, pg_namespace
  WHERE
    indrelid = pg_class.oid AND
    nspname = 'public' AND
    pg_class.relnamespace = pg_namespace.oid AND
    pg_attribute.attrelid = pg_class.oid AND
    pg_attribute.attnum = any(pg_index.indkey)
   AND indisprimary/, [], opts())

    result.rows
    |> Enum.map(fn row ->
      Enum.zip(result.columns, row) |> Map.new()
    end)
  end

  def get_schema(conn) do
    {:ok, data} = Postgrex.query(conn, ~s/select
      table_catalog,
      CONCAT('\"\', table_schema,\'\".\"\', table_name, \'\"\') as table_name,
      table_name as readable_table_name,
      table_schema,
      json_agg((select x from (select cast(column_name as text) as "name", cast(data_type as text) as "data_type") x)) as columns
      from information_schema.columns
      where information_schema.columns.table_schema not in ('information_schema', 'pg_catalog')
        group by table_catalog,table_schema, table_name/, [], opts())

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

  def execute(conn, query, options \\ %{})

  def execute(conn, query, _options) when is_map(query) do
    {limited, exec_query} =
      sql(query, :postgres)
      |> limit_rows_in_query(2000)

    run_query(conn, query, exec_query, limited)
  end

  def execute(conn, query, options) when is_binary(query) do
    {limited, exec_query} = query |> limit_rows_in_query(2000)
    run_query(conn, query, exec_query, limited)
  end

  def execute_with_stream(pid, query, mapper_fn, options \\ %{})

  def execute_with_stream(pid, query, mapper_fn, _options) when is_binary(query) do
    Postgrex.transaction(
      pid,
      fn conn ->
        {:ok, query} = Postgrex.prepare(conn, "", query, opts())
        columns = query.columns

        rows =
          Postgrex.stream(conn, query, [], stream_opts())
          |> Stream.map(fn %Postgrex.Result{rows: rows} -> rows end)

        mapper_fn.(rows, columns)
      end,
      txn_opts
    )
  end

  defp run_query(conn, _query, exec_query, limited) do
    try do
      query = Postgrex.prepare(conn, "", exec_query, opts)

      case query do
        {:ok, prepared_query} ->
          {:ok, results} = Postgrex.execute(conn, prepared_query, [], opts())

          {:ok,
           %{
             columns: results.columns,
             rows: results.rows,
             limited: limited,
             limit: 2000,
             limited_query: exec_query
           }}

        {:error, error} ->
          {:error, error.postgres}
      end
    rescue
      DBConnection.ConnectionError ->
        {:error, %{message: "Query Timed Out. Please Try to optimize your query"}}
    end
  end
end
