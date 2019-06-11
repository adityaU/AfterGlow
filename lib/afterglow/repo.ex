defmodule AfterGlow.Repo do
  use Ecto.Repo,
    otp_app: :afterglow,
    adapter: Ecto.Adapters.Postgres

  def init(_, opts) do
    if url = System.get_env("DATABASE_URL") do
      {:ok, Keyword.put(opts, :url, url)}
    else
      {:ok, opts}
    end
  end
end
