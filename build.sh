#!/bin/zsh
#

source ~/.zshrc

cd frontend-v2
n 18.7 && quasar build

cd ..
activate_24
MIX_ENV=prod mix  distillery.release
docker build -t adityau/afterglow:$1-dev .

activate_24-no-jit
MIX_ENV=prod mix  distillery.release
docker build -t adityau/afterglow:$1-no-jit .

docker push adityau/afterglow:$1-dev
docker push adityau/afterglow:$1-no-jit
