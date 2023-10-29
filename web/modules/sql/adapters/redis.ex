defmodule AfterGlow.Sql.Adapters.Redis do
  import AfterGlow.Utils.Integer
  use Supervisor
  alias DbConnection
  alias AfterGlow.Sql.Pools.Redis, as: RedisPool

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

    unique_id =
      :crypto.hash(:sha256, Jason.encode!(config))
      |> Base.encode16()
      |> String.downcase()

    username = if config["username"] == "nil", do: nil, else: config["username"]

    args =
      config
      |> Map.merge(%{
        "username" => username,
        "query_timeout" => query_timeout,
        "pool_size" => pool_size,
        "unique_id" => unique_id
      })
      |> Enum.map(fn {key, value} -> {String.to_existing_atom(key), value} end)

    proc = Supervisor.start_link([{RedisPool, args}], strategy: :one_for_one)

    {:ok,
     %{
       query_options: [timeout: checkout_timeout],
       pool_size: pool_size,
       unique_id: unique_id,
       conn:
         proc
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
    []
  end

  def execute(conn, query, frontend_limit, options \\ %{})

  def execute(conn, query, frontend_limit, _options) do
    run_query(conn, query, query, false, frontend_limit)
  end

  def execute_with_stream(conn, query, download_limit, mapper_fn, options \\ %{})

  def execute_with_stream(conn, query, download_limit, mapper_fn, _options) do
    run_query(conn, query, query, false, download_limit)
  end

  defp run_query(conn, _query, exec_query, limited, frontend_limit) do
    exec_query =
      exec_query
      |> String.trim()
      |> String.split("\n")

    try do
      query = RedisPool.pipeline(conn, exec_query)

      case query do
        {:ok, results} ->
          results =
            results
            |> Enum.map(fn resp ->
              case resp do
                %Redix.Error{} ->
                  %{error: resp.message}

                _ ->
                  resp
              end
            end)

          r =
            exec_query
            |> Enum.with_index()
            |> Enum.map(fn {command, i} ->
              [command, results |> Enum.at(i)]
            end)

          {:ok,
           %{
             columns: ["query", "results"],
             rows: r,
             limited: limited,
             limit: frontend_limit,
             limited_query: exec_query
           }}

        {:error, e = %Redix.ConnectionError{}} ->
          {:error, %{message: "Connection Error: " <> (e.reason |> to_string())}}

        {:error, e = %Redix.Error{}} ->
          {:error, %{message: e.message}}

        {:error, error} ->
          {:error, error}
      end
    rescue
      e ->
        {:error, %{message: e.message.message}}
    end
  end
end
