FROM elixir:1.4.0
MAINTAINER Aditya Upadhyay <im.adityau@gmail.com>


RUN apt-get update
RUN apt-get install -y nano wget dialog net-tools git
RUN apt-get install -y nginx


RUN mkdir -p /var/app

RUN perl -pi -e 's/http.debian.net/ftp.uk.debian.org/' /etc/apt/sources.list

RUN apt-get update -qq
RUN apt-get install -qq -y build-essential libpq-dev git

# install node

ENV HOME /src/node/
ENV NVM_DIR /src/node/.nvm
ENV NODE_VER v6.5.0
ENV ADMIN_EMAIL im.adityau@gmail.com

# setup the nvm environment

# Install nvm with node and npm
RUN /bin/bash -c "curl https://raw.githubusercontent.com/creationix/nvm/v0.30.1/install.sh | bash \
&& source $NVM_DIR/nvm.sh \
&& nvm install $NODE_VER \
&& nvm alias default $NODE_VER \
&& nvm use --delete-prefix $NODE_VER \
&& nvm use default"

ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VER/bin
ENV PATH      $NVM_DIR/versions/node/$NODE_VER/bin:$PATH
RUN npm install -g ember-cli@2.12.0
RUN npm install -g bower

WORKDIR /var/app
# RUN /bin/bash -c "source /src/node/.profile && npm install -g bower && npm install -g ember-cli"
#

COPY ./mix.exs /var/app/
COPY ./mix.lock /var/app/

ENV MIX_ENV=prod
RUN mix local.hex --force
RUN mix local.rebar --force
RUN mix deps.get
RUN mix deps.compile

RUN mkdir -p frontend
WORKDIR /var/app/frontend/

COPY ./frontend/package.json /var/app/frontend/
COPY ./frontend/bower.json /var/app/frontend/
RUN npm install
RUN bower install --allow-root

WORKDIR /var/app
COPY ./web/ /var/app/web/
COPY ./config/ /var/app/config/
COPY ./lib/ /var/app/lib/
COPY ./priv/ /var/app/priv/
COPY ./start.sh /var/app/start.sh
RUN mix deps.clean ja_serializer && mix deps.get
RUN mix compile


COPY ./frontend/app/ /var/app/frontend/app/
COPY ./frontend/vendor/ /var/app/frontend/vendor/
COPY ./frontend/public/ /var/app/frontend/public/
COPY ./frontend/config/ /var/app/frontend/config/
COPY ./frontend/ember-cli-build.js /var/app/frontend/
WORKDIR /var/app/frontend/
RUN ember build --prod


WORKDIR /var/app
#RUN bundle exec rake assets:precompile
RUN rm -v /etc/nginx/nginx.conf
COPY ./.docker/nginx.conf /etc/nginx/nginx.conf


EXPOSE 80


CMD bash /var/app/start.sh
