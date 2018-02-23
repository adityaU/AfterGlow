defmodule AfterGlow.Mixfile do
  use Mix.Project

  def project do
    [app: :afterglow,
     version: "0.0.1",
     elixir: "~> 1.6.0-rc.0",
     elixirc_paths: elixirc_paths(Mix.env),
     compilers: [:phoenix, :gettext] ++ Mix.compilers,
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     consolidate_protocols: true,
     aliases: aliases(),
     deps: deps()]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [mod: {AfterGlow, []},
     applications: [:phoenix, :phoenix_pubsub, :phoenix_html, :cowboy, :logger, :gettext,
                    :phoenix_ecto, :postgrex, :oauth2, :flasked, :db_connection, :poolboy,
                    :bamboo, :bamboo_smtp, :cachex]]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "web", "test/support"]
  defp elixirc_paths(_),     do: ["lib", "web"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [{:phoenix, "~> 1.3.0"},
     {:phoenix_pubsub, "~> 1.0"},
     {:phoenix_ecto, "~> 3.0"},
     {:postgrex, ">= 0.0.0"},
     {:phoenix_html, "~> 2.6"},
     {:phoenix_live_reload, "~> 1.0", only: :dev},
     {:gettext, "~> 0.11"},
     {:cors_plug, "~> 1.2"},
     {:ja_serializer, "~> 0.11.2"},
     {:sql_dust, path: 'web/modules/sql_dust'},
     {:ecto_enum, "~> 1.0"},
     {:cowboy, "~> 1.0"},
     {:oauth2, "~> 0.9"},
     {:joken, "~> 1.1"},
     {:libsodium, "~> 0.0.3"},
     {:keccakf1600, "~> 0.0.1"},
     {:libdecaf, "~> 0.0.1"},
     {:flasked, "~> 0.4"},
     {:bodyguard, "~> 1.0.0"},
     {:httpoison, "~> 0.11.1"},
     {:csv, "~> 2.1.1"},
     {:secure_random, "~> 0.5"},
     {:ex_aws, "~> 2.0"},
     {:ex_aws_s3, "~> 2.0"},
     {:sweet_xml, "~> 0.6.0"},
     {:bamboo, "~> 0.8.0"},
     {:bamboo_smtp, "~> 1.4.0"},
     {:cachex, git: "https://github.com/whitfin/cachex.git" },
     {:mariaex,  git: "https://github.com/xerions/mariaex.git", override: true}
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to create, migrate and run the seeds file at once:
  #
  #     $ mix ecto.setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    ["ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
     "ecto.reset": ["ecto.drop", "ecto.setup"],
     "test": ["ecto.create --quiet", "ecto.migrate", "test"]]
  end
end
