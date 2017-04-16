service nginx start
mix ecto.create
mix ecto.migrate
mix run priv/repo/seed_admin.exs
PORT=4000 mix phoenix.server
