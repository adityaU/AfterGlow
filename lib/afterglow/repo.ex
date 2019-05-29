defmodule AfterGlow.Repo do
  use Ecto.Repo,
    otp_app: :afterglow,
    adapter: Ecto.Adapters.Postgres
end
