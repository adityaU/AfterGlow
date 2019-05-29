defmodule AfterGlow.Repo.Migrations.AddObanJobTable do
  use Ecto.Migration
  defdelegate up, to: Oban.Migrations
  defdelegate down, to: Oban.Migrations
end
