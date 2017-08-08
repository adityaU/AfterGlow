require IEx
defmodule AfterGlow.Sql.Adapters.Mongo do
  alias AfterGlow.Sql.Adapters.QueryMakers.Mongo, as: QueryMaker
  def create_pool(config) do
    conn = Mongo.start_link(
      hostname: config["host_url"],
      username: config["username"],
      password: config["password"],
      database: config["db_name"],
      port: config["port"],
      timeout: 240000,
      connect_timeout: 240000,
      handshake_timeout: 240000,
      ownership_timeout: 240000,
      pool_timeout: 240000,
      pool: DBConnection.Poolboy,
      pool_size: 10,
    )
  end

  def opts do
    [timeout: 240000, pool: DBConnection.Poolboy, pool_timeout: 240000, slave_ok: true]
  end

  def get_schema(conn) do
    schema = get_collections(conn)
    |> Enum.map(fn coll ->
      Mongo.find(conn, coll, %{}, Keyword.merge([limit: 1, sort: %{"_id" => -1}], opts))
      |> Enum.to_list
      |> Enum.map(fn doc ->
        columns = doc
        |> Map.keys
        |> Enum.map(fn key ->
          %{"name" => key,
            "data_type" => find_data_type(doc[key])
           }
        end)
        %{"table_name" => coll, "columns" => columns, "readable_table_name" => coll}
      end)
    end)
    |> List.flatten
    {:ok, schema}
  end

  def find_data_type(val) when is_integer(val), do: "integer"
  def find_data_type(val) when is_float(val), do: "float"
  def find_data_type(val) when is_boolean(val), do: "boolean"
  def find_data_type(val) when is_binary(val), do: "string"
  def find_data_type(val) when is_nil(val), do: "string"
  def find_data_type(val) when is_map(val) do
    map = val
    |> Map.keys
    case map 
    |> Enum.member?(:utc) do
      true -> "datetime"
      false -> case map |> Enum.member?(:value) do
                 true -> "uuid"
                 false -> "json"
               end
    end
  end

  def find_data_type(val) do
    "unknown"
  end

  def get_collections(conn) do
    Mongo.find(conn, "system.indexes",
      %{"key" => %{"_id": 1}},
      Keyword.merge([sort: %{_id: -1}], opts)
    )
    |> Enum.to_list
    |> Enum.map(fn d ->
      String.split(d["ns"], ".") |> List.last
    end)

  end

  def query_string query_record do
    QueryMaker.mongoql(query_record)
  end

  def execute(conn, query, options \\ %{})
  def execute(conn, query, options) when is_map(query)  do
    query = QueryMaker.mongoql(query)
    Mongo.raw_find(conn, query, %{}, opts) 
  end

  def parse_value(val) when is_map(val) do
    map = val
    |> Map.keys
    case map 
    |> Enum.member?(:utc) do
      true -> val.utc
      false -> case map |> Enum.member?(:value) do
                 tre ->
                   BSON.ObjectId.encode!(val)
                 false -> val
               end
    end
  end

  def parse_value(val) do
    val
  end

  def parse_results(results) do
    columns = results
    |> Enum.map(fn doc ->
      doc |> Map.keys()
    end)
    |> List.flatten
    |> Enum.uniq

    rows = results
    |> Enum.map(fn doc ->
      columns |> Enum.map(fn el ->
        parse_value(doc[el])
      end)
    end)
    {:ok, %{columns: columns, rows: rows}}
  end

  def query_object(query) do
    try do
      {:ok , Execjs.eval(query)}
    rescue
      Execjs.RuntimeError ->
        {:error, %{message: "Invalid Javascript Object"}}
    end
  end

  def execute(conn, query, options) when is_binary(query)  do
    case query_object(query) do
      {:ok, query} ->
        pipeline = QueryMaker.query_to_aggregate(query,options[:table], opts)
        case Mongo.command(conn, pipeline , opts)  do
          {:ok, results} ->
            IEx.pry
            parse_results(results["result"])
          {:error, error} -> {:error, error}
        end
      {:error, error}->
        {:error, error}
    end
  end
end
