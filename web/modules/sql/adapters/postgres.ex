defmodule SimpleBase.Sql.Adapters.Postgres do
  alias SimpleBase.Sql.Adapters.Common, as: QueryMaker
  def create_pool(config) do
    Postgrex.start_link(
      hostname: config["host_url"],
      username: config["username"],
      password: config["password"],
      database: config["db_name"],
      port: config["port"],
      types: SimpleBase.PostgrexTypes
    )
  end

  def get_schema(conn) do
    {:ok, data} = Postgrex.query(conn, "select
                    table_catalog,
                    CONCAT('\"', table_schema,'\".\"', table_name, '\"') as table_name,
                    table_name as readable_table_name,
                    table_schema,
                    array_agg(json_build_object('name', cast(column_name as text),'data_type', cast(data_type as text))) as columns
                    from information_schema.columns where table_schema = 'public'
                    group by table_catalog,table_schema, table_name",[])

    {:ok, data.rows
    |> Enum.map(fn row ->
      Enum.zip(data.columns, row)  |> Map.new
    end)}
   

  end

  def query_string query_record do
    QueryMaker.sql(query_record, :postgres)
  end

  def execute(conn, query, options \\ %{})
  def execute(conn, query, options) when is_map(query)  do
    query = QueryMaker.sql(query, :postgres)
    query = Postgrex.prepare(conn, "", query, [] )
    case query do
      {:ok, prepared_query} -> 
        Postgrex.execute(conn, prepared_query, []) 
      {:error, error} ->
        {:error, error.postgres}
    end
  end

  def execute(conn, query, options) when is_binary(query)  do
    query = Postgrex.prepare(conn, "", query, [] )
    case query do
      {:ok, prepared_query} -> 
        Postgrex.execute(conn, prepared_query, []) 
        {:error, error} ->
        {:error, error.postgres}
    end
  end
end
