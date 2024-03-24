cd /var/app/backend
export AG_PORT=80
export RUST_BACKTRACE=full
./backend migrate
./backend serve
