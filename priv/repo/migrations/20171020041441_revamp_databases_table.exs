defmodule AfterGlow.Repo.Migrations.RevampDatabasesTable do
  use Ecto.Migration

  def change do
    alter table(:databases) do
      remove :db_type
      remove :config
      remove :unique_identifier
      add :db_url, :string
    end
  end
end
