service nginx start
PORT=4000 _build/prod/rel/afterglow/bin/afterglow migrate
PORT=4000 _build/prod/rel/afterglow/bin/afterglow seed
PORT=4000 _build/prod/rel/afterglow/bin/afterglow foreground