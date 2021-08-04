# AfterGlow
## Quick Start
You can simply use docker to run afterglow. there are 4 things that you need before running docker command
* machine/VM. install docker on this machine. - Your laptop if you are just trying out.
* Postgres server - install postgres on your laptop. On AWS/GCP make sure your VM can talk to postgres server. check Security Groups
* DNS entry to access the machine.  e.g. bi.example.com 
* Create an oauth app from [here](https://console.developers.google.com/) and generate google clientID and secret. Use http://<dns_entry>/api/google/callback in callback field.

once you are done Just run following command on the VM/Laptop:
```bash
sudo docker run -itd -p 80:80 -e DATABASE_URL=postgres://<postgres>:5432/afterglow -e AG_APP_ROOT=http://<dns.entry>/ -e AG_GOOGLE_DOMAIN=<google domain to authorize> -e AG_GOOGLE_CLIENT_ID=<google oauth client ID> -e AG_GOOGLE_CLIENT_SECRET=<google client secret> -e AG_ADMIN_EMAIL=<initial_admin_email> adityau/afterglow:0.16.2-goauth-1
```



* [Getting Started With Afterglow](http://getafterglow.in/index.php/documentation/getting-started-with-afterglow/)
* [Documentation](http://getafterglow.in/index.php/documentation/)


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
