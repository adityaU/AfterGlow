FROM debian:stable-slim
LABEL maintainer="Aditya Upadhyay <im.adityau@gmail.com>"
WORKDIR /var/app
RUN mkdir -p /var/app/backend
COPY  backend/target/release/backend  /var/app/backend/backend
# WORKDIR /var/app/frontend/
# COPY frontend/dist/ ./
WORKDIR /var/app/frontend-v2/
RUN mkdir -p /var/app/frontend-v2/dist
COPY frontend-v2/dist/ ./dist/ 

WORKDIR /var/app
COPY ./start.sh /var/app
#RUN bundle exec rake assets:precompile

from alpine:latest
RUN apk add --no-cache libpq openssl gcompat bash 

COPY --from=0 /var/app /var/app

EXPOSE 4300


CMD bash /var/app/start.sh
