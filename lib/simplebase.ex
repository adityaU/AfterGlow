defmodule AfterGlow do
  use Application


  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec

    # Define workers and child supervisors to be supervised

    redis_pool_size = 5
    Postgrex.Types.define(AfterGlow.PostgrexTypes, [Postgrex.Extensions.JSON, AfterGlow.Sql.Postgres.Extensions.UUID], json: Poison)
    #redis pool
    redix_workers = 0..(redis_pool_size - 1) |> Enum.map(fn i ->
      i |> IO.inspect
      worker(Redix, [Application.get_env(:afterglow, :redis_url), [name: :"redix_#{Integer.to_string(i)}"]], id: {Redix, i})
    end)
    children = [
      # Start the Ecto repository
      supervisor(AfterGlow.Repo, []),
      # Start the endpoint when the application starts
      supervisor(AfterGlow.Endpoint, []),
      supervisor(Registry, [:unique, AfterGlow.DbConnectionStore]),
      supervisor(AfterGlow.Sql.DbConnection, []),
      supervisor(AfterGlow.Async, []),
      # Start your own worker by calling: AfterGlow.Worker.start_link(arg1, arg2, arg3)
      # worker(AfterGlow.Worker, [arg1, arg2, arg3]),
    ] ++ redix_workers

    # See http://elixir-lang.org/docs/stable/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: AfterGlow.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    AfterGlow.Endpoint.config_change(changed, removed)
    :ok
  end
end
