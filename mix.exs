defmodule AfterGlow.Mixfile do
  use Mix.Project

  def project do
    [
      app: :afterglow,
      version: "0.0.1",
      elixir: "~> 1.14",
      elixirc_paths: elixirc_paths(Mix.env()),
      compilers: [:phoenix, :gettext] ++ Mix.compilers(),
      build_embedded: Mix.env() == :prod,
      start_permanent: Mix.env() == :prod,
      consolidate_protocols: true,
      aliases: aliases(),
      deps: deps()
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {AfterGlow, []},
      extra_applications: [:odbc],
      applications: [
        :phoenix,
        :phoenix_pubsub,
        :phoenix_html,
        :cowboy,
        :logger,
        :gettext,
        :postgrex,
        :oauth2,
        :flasked,
        :db_connection,
        :bamboo,
        :bamboo_smtp,
        :bodyguard,
        :cors_plug,
        :csv,
        :ecto_enum,
        :ex_aws,
        :ex_aws_s3,
        :httpoison,
        :ja_serializer,
        :joken,
        :keccakf1600,
        :libdecaf,
        :libsodium,
        :secure_random,
        :sweet_xml,
        :jason,
        :unsafe,
        :myxql,
        :quantum,
        :ecto_sql,
        :timex,
        :numerix,
        :oban,
        :mongodb,
        :plug_cowboy
      ]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "web", "test/support"]
  defp elixirc_paths(_), do: ["lib", "web"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:phoenix, "~> 1.6.0"},
      {:phoenix_pubsub, "~> 2.0"},
      {:postgrex, ">= 0.17.1", override: true},
      {:phoenix_html, "~> 2.14"},
      {:ecto, "~> 3.1"},
      {:mongodb, "~> 1.0"},
      {:decimal, "~> 2.0", override: true},
      {:phoenix_live_reload, "~> 1.0", only: :dev},
      {:gettext, "~> 0.11"},
      {:cors_plug, "~> 1.2"},
      {:ja_serializer, "~> 0.14.0"},
      {:sql_dust, path: 'web/modules/sql_dust'},
      {:ecto_enum, "~> 1.2"},
      {:redix, "~> 1.2"},
      {:castore, ">= 1.0.1"},
      {:cowboy, "~> 2.0"},
      {:oauth2, "~> 2.0"},
      {:joken, "~> 1.1"},
      {:libsodium, "~> 0.0.3"},
      {:keccakf1600, "~> 0.0.1"},
      {:libdecaf, "~> 0.0.1"},
      {:flasked, "~> 0.4"},
      {:bodyguard, "~> 1.0.0"},
      {:httpoison, "~> 2.1.0"},
      {:csv, "~> 2.1.1"},
      {:secure_random, "~> 0.5"},
      {:ex_aws, "~> 2.0"},
      {:ex_aws_s3, "~> 2.0.2"},
      {:sweet_xml, "~> 0.6.0"},
      {:bamboo, "~> 0.8.0"},
      {:bamboo_smtp, "~> 1.4.0"},
      {:distillery, "~> 2.1.1", runtime: false},
      {:jason, "~> 1.1"},
      {:quantum, "~> 2.3"},
      {:timex, "~> 3.0"},
      {:oban, "~> 0.2"},
      {:myxql, "~> 0.6", override: true},
      {:db_connection, "~> 2.0", override: true},
      {:ecto_sql, "~> 3.1.0"},
      {:plug_cowboy, "~> 2.0"},
      {:mustache, "~> 0.3.0"},
      {:numerix, "~> 0.5.1"},
      {:hackney, github: "benoitc/hackney", override: true},
      {:gen_smtp, "~> 0.14.0", override: true},
      {:jsonrpc2, "~> 2.0", override: true},
      {:observer_cli, "~> 1.7"}
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to create, migrate and run the seeds file at once:
  #
  #     $ mix ecto.setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate", "test"]
    ]
  end
end
