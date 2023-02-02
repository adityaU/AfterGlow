# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config
require IEx

# General application configuration
config :afterglow,
  namespace: AfterGlow,
  ecto_repos: [AfterGlow.Repo]

config :afterglow, Oban,
  repo: AfterGlow.Repo,
  queues: [default: 10, alerts: 50]

# Configures the endpoint
config :afterglow, AfterGlow.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "Tn3BxHU8EtAfwHsjDlEk91rjB9OdR3gXZfzOhO4vfK1XbU14yZPNfWsZjaoUvCTD",
  render_errors: [view: AfterGlow.ErrorView, accepts: ~w(html json)],
  pubsub: [name: AfterGlow.PubSub, adapter: Phoenix.PubSub.PG2],
  server: true

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id, :params]

config :logger, level: :debug

config :ja_serializer, key_format: :underscored

config :phoenix, :format_encoders,
  "json-api": Jason,
  json: Jason

config :ecto, json_library: Jason

config :oauth2,
  serializers: %{
    "application/vnd.api+json" => Jason,
    "application/json" => Jason,
    "application/xml" => MyApp.XmlParser
  }

config :quantum,
  date_library: Quantum.DateLibrary.Timex

config :afterglow, AfterGlow.Scheduler,
  debug_logging: false,
  jobs: [
    # [
    #   name: AfterGlow.SnapshotsTasks,
    #   schedule: {:extended, "*/15 * * * * *"},
    #   task: {AfterGlow.SnapshotsTasks, :run, []}
    # ],
    [
      name: AfterGlow.DatabaseSync,
      schedule: {:cron, "*/30 * * * *"},
      task: {AfterGlow.Database.SyncSchedule, :sync, []}
    ],
    [
      name: AfterGlow.CronScheduler,
      schedule: {:cron, "* * * * *"},
      task: {AfterGlow.Scheduler.Jobs.CronScheduler, :run, []}
    ]
  ]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.

config :flasked,
  otp_app: :afterglow,
  map_file: "priv/env.exs"

import_config "#{Mix.env()}.exs"
