FROM erlang:latest
LABEL maintainer="Aditya Upadhyay <im.adityau@gmail.com>"



RUN mkdir -p /var/app/frontend


WORKDIR /var/app
ENV MIX_ENV=prod
COPY _build/ /var/app/_build/prod
WORKDIR /var/app/frontend/
COPY frontend/dist/ ./

WORKDIR /var/app
COPY ./start.sh /var/app
#RUN bundle exec rake assets:precompile

RUN apt-get update
RUN apt-get install -y nginx

RUN rm -v /etc/nginx/nginx.conf
COPY ./.docker/nginx.conf /etc/nginx/nginx.conf



EXPOSE 80


CMD bash /var/app/start.sh
