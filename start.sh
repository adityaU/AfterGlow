service nginx start
_build/prod/rel/afterglow/bin/afterglow migrate
_build/prod/rel/afterglow/bin/afterglow seed
_build/prod/rel/afterglow/bin/afterglow foreground
