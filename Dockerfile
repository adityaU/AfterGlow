# FROM debian:stable-slim as node_builder
#
# RUN apt-get update && apt-get install -y curl build-essential gnupg2 && apt-get clean && rm -rf /var/lib/apt/lists/*
#
# RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
#   && apt-get install -y nodejs \
#   && npm install -g @quasar/cli && npm install -g pnpm 
#
# # Set the working directory
# WORKDIR /var/app/frontend-v2/
#
# COPY frontend-v2/package.json ./package.json 
# COPY frontend-v2/package-lock.json ./package-lock.json 
#
# RUN npm install --verbose
#
# COPY fronend-v2/* ./
#
# RUN quasar build 
#

FROM rust:latest as builder
LABEL maintainer="Aditya Upadhyay <im.adityau@gmail.com>"

RUN apt-get update && apt-get install -y libpq-dev libxml2-dev libxslt1-dev libclang-15-dev libxmlsec1-dev openssl ca-certificates bison && apt-get clean && rm -rf /var/lib/apt/lists/*



ENV PREFIX=/usr/local

# Download, build, and install libxml2
RUN wget http://xmlsoft.org/sources/libxml2-2.9.10.tar.gz && \
  tar -xvzf libxml2-2.9.10.tar.gz && \
  cd libxml2-2.9.10 && \
  ./configure --prefix=${PREFIX} --disable-shared --enable-static && \
  make && make install && \
  cd .. && rm -rf libxml2-2.9.10 libxml2-2.9.10.tar.gz

# Download, build, and install libxslt
RUN wget http://xmlsoft.org/sources/libxslt-1.1.34.tar.gz && \
  tar -xvzf libxslt-1.1.34.tar.gz && \
  cd libxslt-1.1.34 && \
  ./configure --prefix=${PREFIX} --disable-shared --enable-static --with-libxml-prefix=${PREFIX} && \
  make && make install && \
  cd .. && rm -rf libxslt-1.1.34 libxslt-1.1.34.tar.gz

# Download, build, and install gssapi_krb5
RUN wget https://kerberos.org/dist/krb5/1.21/krb5-1.21.3.tar.gz && \
  tar -xvzf krb5-1.21.3.tar.gz && \
  cd krb5-1.21.3/src && \
  ./configure --prefix=${PREFIX} --enable-shared && \
  make && make install && \
  ./configure --prefix=${PREFIX} --disable-shared --enable-static && \
  make && make install && \
  cd ../.. && rm -rf krb5-1.21.3 krb5-1.21.3.tar.gz

# Set environment variables for Rust build
ENV PKG_CONFIG_PATH=${PREFIX}/lib/pkgconfig
ENV LD_LIBRARY_PATH=${PREFIX}/lib


WORKDIR /var/app/

# Copy the Rust project files to the container
#
# Copy the Cargo.toml and Cargo.lock files to the container
#
RUN mkdir crud_derive && mkdir locals && mkdir migrations && mkdir src && mkdir templates
COPY backend/Cargo.toml backend/Cargo.lock ./
COPY backend/crud_derive ./crud_derive
COPY backend/locals ./locals
COPY backend/crud_derive ./crud_derive

# Create a dummy main.rs file to trick Cargo into compiling the dependencies
RUN echo "fn main() { println!(\"dummy\"); }" > src/main.rs
#
# # Build only the dependencies to cache them
#
RUN cargo fetch 

# Remove the dummy main.rs file
RUN rm -rf  src
#
COPY backend/diesel.toml ./diesel.toml
COPY backend/migrations ./migrations
COPY backend/templates ./templates
COPY backend/src ./src

RUN cat src/main.rs
RUN cargo build --release
# #
# #
# # # Build the Rust application
# RUN PKG_CONFIG_PATH=/usr/lib/x86_64-linux-gnu/pkgconfig/pkgconfig:/usr/lib/pkgconfig RUSTFLAGS='-C target-feature=+crt-static'   cargo build --release --target=x86_64-unknown-linux-gnu
# # RUN PKG_CONFIG_PATH=/usr/lib/x86_64-linux-gnu/pkgconfig/pkgconfig:/usr/lib/pkgconfig RUSTFLAGS='-C target-feature=+crt-static' cargo build --release --target=x86_64-unknown-linux-gnu 
# #
# # # Stage 2: Final image
# # FROM debian:stable-slim
# FROM busybox
# LABEL maintainer="Aditya Upadhyay <im.adityau@gmail.com>"
#
# # Install only the necessary runtime dependencies
# # RUN apt-get update && apt-get install -y libpq-dev libxml2-dev libxslt1-dev libclang-15-dev libxmlsec1-dev openssl ca-certificates && apt-get clean && rm -rf /var/lib/apt/lists/* /usr/lib/llvm-15 /usr/lib/x86_64-linux-gnu/libLLVM-15.so.1 /usr/lib/x86_64-linux-gnu/libclang-15.so.15.0.6 
#
# # Set the working directory
#
# WORKDIR /var/app/frontend-v2/dist/spa/
# COPY frontend-v2/dist/spa/ ./
# # Copy the built Rust binary from the builder stage
# WORKDIR /var/app/backend
# COPY --from=builder /var/app/target/x86_64-unknown-linux-gnu/release/backend /var/app/backend/backend
#
# WORKDIR /var/app
# COPY ./start.sh /var/app
#
# # Expose the port on which your application runs
# EXPOSE 80
#
#
# CMD sh /var/app/start.sh
#
FROM debian:stable-slim
# LABEL maintainer="Aditya Upadhyay <im.adityau@gmail.com>"
RUN apt-get update && apt-get install -y libpq-dev libxml2-dev libxslt1-dev libclang-15-dev libxmlsec1-dev openssl ca-certificates && apt-get clean && rm -rf /var/lib/apt/lists/*





# FROM debian:stable-slim
WORKDIR /var/app
RUN mkdir -p /var/app/backend
COPY --from=builder /var/app/target/release/backend /var/app/backend/backend
# WORKDIR /var/app/frontend/
# COPY frontend/dist/ ./
WORKDIR /var/app/frontend-v2/dist/spa/
COPY frontend-v2/dist/spa/ ./ 

WORKDIR /var/app
COPY ./start.sh /var/app


RUN  rm -rf /usr/lib/llvm-15 /usr/lib/x86_64-linux-gnu/libLLVM-15.so.1

#RUN bundle exec rake assets:precompile



EXPOSE 80


CMD sh /var/app/start.sh
