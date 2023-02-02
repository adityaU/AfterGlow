defmodule AfterGlow do
  use Application

  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications

  def start(_type, _args) do
    import Supervisor.Spec

    # Define workers and child supervisors to be supervised

    Postgrex.Types.define(
      AfterGlow.PostgrexTypes,
      [Postgrex.Extensions.JSON, Postgrex.Extensions.INET] ++
        [Postgrex.Extensions.UUIDText, AfterGlow.Postgrex.Extensions.Super],
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
      worker(AfterGlow.Scheduler, []),
      # {Oban, Application.get_env(:afterglow, Oban)},

      # Start your own worker by calling: AfterGlow.Worker.start_link(arg1, arg2, arg3)
      worker(Cachex, [:cache, []]),
      worker(
        Task,
        [&AfterGlow.SnapshotsTasks.cancel_all_in_process_snapshots/0],
        restart: :temporary
      )

      # worker(AfterGlow.Worker, [arg1, arg2, arg3]),
    ]

    # See http://elixir-lang.org/docs/stable/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_all, name: AfterGlow.Supervisor, restart: :permanent]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    AfterGlow.Endpoint.config_change(changed, removed)
    :ok
  end
end
