service nginx start
cd chart_renderer/ && n 18.7.0 && pm2 start main.js & 
cd /var/app/
PORT=4000 _build/prod/rel/afterglow/bin/afterglow migrate
PORT=4000 _build/prod/rel/afterglow/bin/afterglow seed
PORT=4000 _build/prod/rel/afterglow/bin/afterglow foreground
