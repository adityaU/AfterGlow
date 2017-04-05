FROM elixir:1.3.1
MAINTAINER Aditya Upadhyay <aditya.upadhyay@oyorooms.com>


RUN apt-get update
RUN apt-get install -y nano wget dialog net-tools git
RUN apt-get install -y nginx


RUN mkdir -p /var/app

RUN perl -pi -e 's/http.debian.net/ftp.uk.debian.org/' /etc/apt/sources.list

RUN apt-get update -qq
RUN apt-get install -qq -y build-essential libpq-dev git

# install node

ENV HOME /src/node/
ENV NODE_VER v0.12.7

# setup the nvm environment

RUN git clone https://github.com/creationix/nvm.git $HOME/.nvm

RUN /bin/bash -c 'source ~/.nvm/nvm.sh &&  nvm install ${NODE_VER}'
RUN echo '\n#The Following loads nvm, and install Node.js which version is assigned to $NODE_ENV' >> $HOME/.profile
RUN echo '. ~/.nvm/nvm.sh' >> $HOME/.profile
RUN echo 'echo "Installing node@${NODE_VER}, this may take several minutes..."' >> $HOME/.profile
RUN echo 'nvm alias default ${NODE_VER}' >> $HOME/.profile
RUN echo 'echo "Install node@${NODE_VER} finished."' >> $HOME/.profile
WORKDIR /var/app
COPY ./ /var/app/
# RUN /bin/bash -c "source /src/node/.profile && npm install -g bower && npm install -g ember-cli"
#

ENV MIX_ENV=prod
RUN mix local.hex --force
RUN mix deps.get
RUN mix compile


#RUN bundle exec rake assets:precompile
RUN rm -v /etc/nginx/nginx.conf
COPY ./.docker/nginx.conf /etc/nginx/nginx.conf


EXPOSE 80


CMD bash /var/app/start.sh