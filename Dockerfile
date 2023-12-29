FROM debian:stable-slim
LABEL maintainer="Aditya Upadhyay <im.adityau@gmail.com>"
RUN apt-get update && apt-get install -y nginx libpq-dev openssl ca-certificates && apt-get clean && rm -rf /var/lib/apt/lists/*
WORKDIR /var/app
RUN mkdir -p /var/app/backend
COPY  backend/target/release/backend  /var/app/backend/backend
# WORKDIR /var/app/frontend/
# COPY frontend/dist/ ./
WORKDIR /var/app/frontend-v2/dist/spa/
COPY frontend-v2/dist/spa/ ./ 

WORKDIR /var/app
COPY ./start.sh /var/app
#RUN bundle exec rake assets:precompile



RUN rm -v /etc/nginx/nginx.conf
COPY ./.docker/nginx.conf /etc/nginx/nginx.conf



EXPOSE 80


CMD sh /var/app/start.sh
