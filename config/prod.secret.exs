use Mix.Config

# In this file, we keep production configuration that
# you'll likely want to automate and keep away from
# your version control system.
#
# You should document the content of this
# file or create a script for recreating it, since it's
# kept out of version control and might be hard to recover
# or recreate for your teammates (or yourself later on).
config :afterglow, AfterGlowWeb.Endpoint,
  secret_key_base: "Y+oUKLZFrFf9BcujZcIe8lRZ1FJoQ2pPmO6x99oanAuYKWooPYmPdUdZN8LzQt4P"

# Configure your database
config :afterglow, AfterGlow.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: System.get_env("AG_DATABASE_USERNAME"),
  password: System.get_env("AG_DATABASE_PASSWORD"),
  database: System.get_env("AG_DATABASE_NAME"),
  hostname: System.get_env("AG_DATABASE_HOSTNAME"),
  timeout: :infinity,
  pool_size: 100

config :new_relixir,
  application_name: "afterglow",
  license_key: System.get_env("AG_NEWRELIC_LICENCE_KEY")
