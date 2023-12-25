service nginx start
cd /var/app/
_build/prod/backend migrate
_build/prod/backend serve
