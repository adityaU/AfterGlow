defmodule SimpleBase.Repo.Migrations.AddMoreFieldsToDatabases do
  use Ecto.Migration

  def change do
    alter table(:databases) do
      add :last_accessed_at, :utc_datetime
    end

  end
end
