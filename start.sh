service nginx start
mix ecto.create
mix ecto.migrate
PORT=4000 mix phoenix.server
