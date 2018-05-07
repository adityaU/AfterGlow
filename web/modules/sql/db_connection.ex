require IEx

defmodule AfterGlow.Sql.DbConnection do
  use GenServer

  @adapter_modules %{
    postgres: AfterGlow.Sql.Adapters.Postgres,
    mysql: AfterGlow.Sql.Adapters.Mysql,
    influxdb: AfterGlow.Sql.Adapters.InfluxDb,
    redshift: AfterGlow.Sql.Adapters.Redshift
  }

  # client methods
  def start_link do
    GenServer.start_link(__MODULE__, nil, name: :db_connection_store)
  end

  def connection(db_record) do
    GenServer.call(:db_connection_store, {:connection, db_record})
  end

  def query_string(db_record, query_record) do
    @adapter_modules[db_record[:db_type] |> String.to_atom()].query_string(query_record)
  end

  def execute(db_record, query_record) do
    {:ok, conn} = connection(db_record)
    @adapter_modules[db_record[:db_type] |> String.to_atom()].execute(conn, query_record)
  end

  def execute_with_stream(db_record, query_record, mapper_fn) do
    {:ok, conn} = connection(db_record)

    @adapter_modules[db_record[:db_type] |> String.to_atom()].execute_with_stream(
      conn,
      query_record,
      mapper_fn
    )
  end

  def get_schema(db_record) do
    {:ok, conn} = connection(db_record)
    @adapter_modules[db_record[:db_type] |> String.to_atom()].get_schema(conn)
  end

  # genserver handle messages
  def init(_) do
    {:ok, nil}
  end

  def handle_call({:connection, db_record}, _from, _) do
    key = db_record[:unique_identifier]
    stored_value = Registry.lookup(AfterGlow.DbConnectionStore, key) |> Enum.at(0)

    pid =
      case stored_value do
        nil ->
          case @adapter_modules[db_record[:db_type] |> String.to_atom()].create_pool(
                 db_record[:config]
               ) do
            {:ok, pid} ->
              Registry.register(AfterGlow.DbConnectionStore, key, pid)
              {:ok, pid}

            {:error, error} ->
              {:error, error}
          end

        _ ->
          {_, value} = stored_value
          {:ok, value}
      end

    {:reply, pid, nil}
  end
end
