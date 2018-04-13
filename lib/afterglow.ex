defmodule AfterGlow do
  use Application

  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications

  def start(_type, _args) do
    import Supervisor.Spec

    # Define workers and child supervisors to be supervised

    Postgrex.Types.define(
      AfterGlow.PostgrexTypes,
      [Postgrex.Extensions.JSON, Postgrex.Extensions.INET] ++ [Postgrex.Extensions.UUIDText],
      json: Jason
    )

    children = [
      # Start the Ecto repository
      supervisor(AfterGlow.Repo, []),
      # Start the endpoint when the application starts
      supervisor(AfterGlow.Endpoint, []),
      supervisor(Registry, [:unique, AfterGlow.DbConnectionStore]),
      supervisor(AfterGlow.Sql.DbConnection, []),
      supervisor(AfterGlow.Async, []),

      # Start your own worker by calling: AfterGlow.Worker.start_link(arg1, arg2, arg3)
      worker(Cachex, [:cache, []]),
      worker(Task, [&AfterGlow.SnapshotScheduler.schedule/0], restart: :temporary)

      # worker(AfterGlow.Worker, [arg1, arg2, arg3]),
    ]

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
