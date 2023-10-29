defmodule AfterGlow.Sql.Adapters.Mongo do
  use AfterGlow.Sql.Adapters.QueryMakers.Common
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
       query_options: [man_time: query_timeout],
       conn:
         Mongo.start_link(
           hostname: config["host_url"],
           username: config["username"],
           password: config["password"] |> IO.inspect(label: "password"),
           database: config["db_name"],
           port: config["host_port"],
           auth_source: "admin",
           connect_timeout_ms: checkout_timeout,
           queue_target: checkout_timeout,
           queue_interval: checkout_timeout,
           pool: DBConnection.ConnectionPool,
           pool_size: pool_size
         )
         |> elem(1)
     }}
  end

  def stream_opts do
    [timeout: 12_000_000, pool: DBConnection.Poolboy, pool_timeout: 12_000_000, max_rows: 2000]
  end

  def txn_opts do
    [timeout: 12_000_000, pool: DBConnection.Poolboy, pool_timeout: 12_000_000]
  end

  def get_fkeys(conn) do
    []
  end

  def get_primary_keys(conn) do
    []
  end

  def get_schema(conn) do
    []
  end

  def query_string(query_record) do
    query_record |> get_in([:table, "name"])
  end

  def make_dependency_raw_query(column, foreign_column, table, value, value_column, primary_keys) do
  end

  def execute(conn, query, frontend_limit, options \\ %{})

  def execute(conn, query, frontend_limit, _options) when is_map(query) do
    run_query(conn, query, query, false, frontend_limit)
  end

  def execute(conn, query, frontend_limit, _options) when is_binary(query) do
    run_query(conn, query, query, false, frontend_limit)
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

    Postgrex.transaction(
      pid.conn,
      fn conn ->
        {:ok, query} = Postgrex.prepare(conn, "", query, pid.query_options)
        columns = query.columns

        rows =
          Postgrex.stream(conn, query, [], stream_opts())
          |> Stream.map(fn %Postgrex.Result{rows: rows} -> rows end)

        mapper_fn.(rows, columns)
      end,
      txn_opts
    )
  end

  defp run_query(conn, _query, exec_query, limited, frontend_limit) do
    try do
      exec_query =
        %BSON.Binary{binary: exec_query}
        |> IO.inspect()

      results =
        Mongo.command(conn.conn, exec_query, conn.query_options)
        |> IO.inspect(label: "mongo output==========================")

      case results do
        {:ok, prepared_query} ->
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

        {:error, e = %Mongo.Error{}} ->
          {:error, %{message: e.message}}

        {:error, error} ->
          {:error, error.postgres}
      end
    rescue
      e ->
        {:error, %{message: e.message}}
    end
  end
end
