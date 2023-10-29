defmodule AfterGlow.Sql.Adapters.ClickHouse do
  import AfterGlow.Sql.Adapters.QueryMakers.Clickhouse
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

    # username = if config["username"] == "nil", do: nil, else: config["username"]

    pool = [
      :hackney_pool.child_spec(unique_id,
        timeout: checkout_timeout + query_timeout,
        max_connections: pool_size
      )
    ]

    proc = Supervisor.start_link(pool, strategy: :one_for_one)

    {:ok,
     %{
       query_options: [timeout: checkout_timeout],
       pool_size: pool_size,
       pool_name: unique_id,
       config: config,
       conn: proc |> elem(1)
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
    {:ok, results} =
      run_query(
        conn,
        nil,
        "select primary_key, name from system.tables where database = '#{conn.config["db_name"]}'",
        false,
        1_000_000
      )

    results.rows
    |> Enum.map(fn row ->
      Enum.zip(results.columns, row) |> Map.new()
    end)
    |> Enum.map(fn k ->
      k["primary_key"]
      |> String.split(",")
      |> Enum.map(fn pk ->
        %{"column_name" => pk |> String.trim(), "table_name" => k["name"]}
      end)
    end)
    |> List.flatten()
  end

  def get_schema(conn) do
    {:ok, data} =
      run_query(
        conn,
        nil,
        "select table_name as table_name, table_name as readable_table_name,
    column_name as name, column_type as data_type from information_schema.columns where
    table_schema = '#{conn.config["db_name"]}' order by table_name,ordinal_position",
        false,
        1_000_000
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
    sql(query_record, :postgres)
  end

  def make_dependency_raw_query(column, foreign_column, table, value, value_column, primary_keys) do
    []
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

  def execute_with_stream(conn, query, download_limit, mapper_fn, options \\ %{})

  def execute_with_stream(conn, query, download_limit, mapper_fn, _options) do
    {limited, exec_query} =
      sql(query, :postgres)
      |> limit_rows_in_query(download_limit)

    run_query(conn, query, query, limited, download_limit)
  end

  defp run_query(conn, _query, exec_query, limited, frontend_limit) do
    try do
      url =
        conn.config["scheme"] <>
          conn.config["host_url"] <>
          ":" <>
          ((conn.config["host_port"] || 80) |> to_string()) <>
          "/?database=" <> conn.config["db_name"] <> "&default_format=JSONCompact"

      headers = [
        {"Authorization",
         "Basic " <> Base.encode64(conn.config["username"] <> ":" <> conn.config["password"])},
        {"Content-Type", "application/x-www-form-urlencoded"}
      ]

      query = HTTPoison.post(url, exec_query, headers, hackney: [pool: conn.config["pool_name"]])

      case query do
        {:ok, results} ->
          response = Jason.decode(results.body)

          case response do
            {:ok, response} ->
              {:ok,
               %{
                 columns: response["meta"] |> Enum.map(& &1["name"]),
                 rows: response["data"],
                 limited: limited,
                 limit: frontend_limit,
                 limited_query: exec_query
               }}

            {:error, error} ->
              {:error, %{message: results.body}}
          end

        {:error, e = %HTTPoison.Error{}} ->
          case e do
            %HTTPoison.Error{reason: :nxdomain} ->
              {:error, %{message: "Could not connect to host. URL: #{url}"}}

            _ ->
              {:error, message: e.reason}
          end

        {:error, error} ->
          {:error, error}
      end
    rescue
      e ->
        {:error, %{message: e.message.message}}
    end
  end
end
