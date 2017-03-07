defmodule SimpleBase.Repo.Migrations.AddMoreFieldsToDatabasesAndTables do
  use Ecto.Migration

  def change do
    alter table(:databases) do
      add :unique_identifier, :uuid
    end

    alter table(:tables) do
      add :readable_table_name, :string
    end
  end
end
