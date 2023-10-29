defmodule AfterGlow.Sql.Pools.Redis do
  def child_spec(args) do
    children =
      for index <- 0..(args[:pool_size] - 1) do
        Supervisor.child_spec(
          {Redix,
           name: :"redix_#{args[:unique_id]}_#{index}",
           host: args[:host_url],
           username: args[:username],
           password: args[:password],
           database: args[:db_name],
           port: args[:host_port],
           timeout: args[:query_timeout]},
          id: {:"Redix#{args[:unique_id]}", index}
        )
      end

    child_spec = %{
      id: :"RedixSupervisor#{args[:unique_id]}",
      type: :supervisor,
      start: {Supervisor, :start_link, [children, [strategy: :one_for_one]]}
    }
  end

  def pipeline(conn, commands) do
    commands =
      commands
      |> Enum.map(&OptionParser.split(&1 |> String.trim()))

    Redix.pipeline(:"redix_#{conn.unique_id}_#{random_index(conn)}", commands)
  end

  defp random_index(conn) do
    Enum.random(0..(conn.pool_size - 1))
  end
end
