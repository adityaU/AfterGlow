# AfterGlow

Production Installation
=======================

Easy Way
--------

Docker is the easiest way to run AfterGlow in production. it only takes 5 minutes. Steps are following:
* Install docker if you already didn't
* Pull AfterGlow image from docker registry
```bash
$ docker pull adityau/afterglow:latest
```
* Create credentials for google login on [http://console.developers.google.com](http://console.developers.google.com). Keep you credentials handy. 
* Install postgres database on a machine. or create an RDS postgres database
* Run following command to start AfterGlow
```bash
docker run -it -p 6745:80 \
-e DATABASE_URL=postgres://username:password@postgres_ip:postgres_port/database_name \
-e AG_APP_ROOT=<domain_in_google_app_redirect_uri_with_http(s)> \
-e AG_ALLOWED_GOOGLE_DOMAIN=<google domain(optional)>
-e AG_GOOGLE_CLIENT_ID=<google_client_id>\ 
-e AG_GOOGLE_CLIENT_SECRET=<google_client_secret>\ 
-e AG_ADMIN_EMAIL=<admin_email>\ 
adityau/afterglow
```



To start your Phoenix app:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Start Phoenix endpoint with `mix phoenix.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](http://www.phoenixframework.org/docs/deployment).

## Learn more

  * Official website: http://www.phoenixframework.org/
  * Guides: http://phoenixframework.org/docs/overview
  * Docs: https://hexdocs.pm/phoenix
  * Mailing list: http://groups.google.com/group/phoenix-talk
  * Source: https://github.com/phoenixframework/phoenix
