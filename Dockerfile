FROM ubuntu:18.04
LABEL maintainer="Aditya Upadhyay <im.adityau@gmail.com>"


RUN apt-get update
RUN apt-get install -y nginx libtool build-essential autoconf automake locales
RUN dpkg-reconfigure locales 
RUN sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
    locale-gen
ENV LANG en_US.UTF-8  
ENV LANGUAGE en_US:en  
ENV LC_ALL en_US.UTF-8     
RUN mkdir -p /var/app/frontend


WORKDIR /var/app
ENV MIX_ENV=prod
RUN mkdir -p /var/app/_build/prod
COPY _build/prod /var/app/_build/prod
WORKDIR /var/app/frontend/
COPY frontend/dist/ ./

WORKDIR /var/app
COPY ./start.sh /var/app
#RUN bundle exec rake assets:precompile


RUN rm -v /etc/nginx/nginx.conf
COPY ./.docker/nginx.conf /etc/nginx/nginx.conf



EXPOSE 80


CMD bash /var/app/start.sh
