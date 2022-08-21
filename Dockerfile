FROM ubuntu:22.04
LABEL maintainer="Aditya Upadhyay <im.adityau@gmail.com>"

ENV DEBIAN_FRONTEND=noninteractive
ENV LANG en_US.UTF-8  
ENV LANGUAGE en_US:en  
ENV LC_ALL en_US.UTF-8     
RUN apt-get update
RUN apt-get install -y wget telnet vim nginx libtool build-essential autoconf automake locales alien unixodbc unixodbc-dev odbc-postgresql odbcinst1debian2 odbcinst libodbc1 odbc-mariadb 
RUN dpkg-reconfigure locales 
RUN sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
    locale-gen
RUN mkdir -p /var/app/frontend

WORKDIR /temp

RUN wget https://s3.amazonaws.com/redshift-downloads/drivers/odbc/2.0.0.1/AmazonRedshiftODBC-64-bit-2.0.0.1.x86_64.rpm
RUN alien AmazonRedshiftODBC-64-bit-2.0.0.1.x86_64.rpm
RUN dpkg -i amazonredshiftodbc-64-bit_2.0.0-2_amd64.deb

RUN wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2.16_amd64.deb
RUN dpkg -i libssl1.1_1.1.1f-1ubuntu2.16_amd64.deb


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
COPY ./.docker/odbcinst.ini /etc/odbcinst.ini



EXPOSE 80


CMD bash /var/app/start.sh
