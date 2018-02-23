require IEx
defmodule AfterGlow.Sql.Adapters.InfluxDb do
  alias AfterGlow.Sql.Adapters.QueryMakers.InfluxDb, as: QueryMaker
  def create_pool(config) do
    case HTTPoison.get("#{url(config)}/ping", [], hackney: [pool: config["db_name"]]) do
      {:ok, response} -> 
        {:ok, %{config: config, response: response}}
      {:error, error} ->
        {:error, error}
    end
    
  end

  def get_schema(conn) do
    {:ok, fields} =  http_query(url(conn.config),conn.config["db_name"], "SHOW FIELD KEYS")
    fields = (Poison.decode!(fields.body)["results"] |> Enum.at(0))["series"]
    |> format_schema

    {:ok, tags} =  http_query(url(conn.config),conn.config["db_name"], "SHOW TAG KEYS")
    tags = (Poison.decode!(tags.body)["results"] |> Enum.at(0))["series"]
    |> format_schema
    |> merge_with_fields(fields)
    |> add_time_to_each_measurement
    {:ok, tags}
  end

  def add_time_to_each_measurement(fields) do
    fields
    |> Enum.map(fn x ->
      x |> Map.put("columns", [%{"name" => "time" , "data_type" => "datetime"}] ++ x["columns"])
    end)
  end


  def merge_with_fields(tags, fields) do
    fields
    |> Enum.map(fn x ->
      tags = tags
      |> Enum.filter(fn y -> y["table_name"] == x["table_name"] end)
      z = case tags |> length == 1 do
            true ->
              tag = tags |> Enum.at(0) |> Map.fetch("columns") |> elem(1)
              x |> Map.put("columns", tag ++ x["columns"])
            false ->
              x
          end
      z
    end)
  end

  def format_schema(raw_data) do
    raw_data
    |> Enum.map(fn x -> x |> extract_columns_and_table end)
  end

  def extract_columns_and_table(raw_schema) do
    %{"columns" => _columns, "values" => values, "name" => table_name} = raw_schema
    %{"table_name" => table_name, "readable_table_name" => table_name, "columns" => values |> Enum.map(fn y -> y |> format_columns end)}
  end

  def format_columns(raw_column) do
    %{"name" => raw_column |> Enum.at(0), "data_type" => raw_column |> Enum.at(1)}
  end

  def url(config) do
    url = "#{config["host_url"]}:#{config["host_port"]}"
  end

  def format_results(results) do
    series =  Poison.decode!(results.body)["results"]
    |> Enum.at(0)
    |> Map.fetch("series")
    %{
      "columns" => columns,
      "name" => name,
      "values" => values
    } = case series do
          {:ok,series_val } ->
            series_val
            |> Enum.at(0)
          _ ->
            %{"columns" => [], "name" => "empty", "values" => []}  
        end

    %{columns: columns, rows: values}
  end
  def http_query(url, db_name, query) do
    HTTPoison.get("#{url}/query?#{URI.encode_query(%{db: db_name, q: query} )}")
  end

  def query_string query_record do
    QueryMaker.sql(query_record)
  end

  def execute(conn, query, options \\ %{})
  def execute(conn, query, options) when is_map(query)  do
    query = QueryMaker.sql(query) |> QueryMaker.limit_rows_in_query(2000)
    {:ok, results}  = http_query(url(conn.config), conn.config["db_name"], query)
    interpret_results(results)
  end

  def execute(conn, query, options) when is_binary(query)  do
    query = query |> QueryMaker.limit_rows_in_query(2000)
    {:ok, results} = http_query(url(conn.config), conn.config["db_name"], query)
    interpret_results(results)
  end

  defp interpret_results(results) do
    results 
    case results.status_code do
      200 ->
        {:ok , format_results(results)}
      _ ->
        {:error , %{message: Poison.decode!(results.body)["error"]}}
    end
  end
end
