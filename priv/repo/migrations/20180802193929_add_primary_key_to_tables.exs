defmodule AfterGlow.Repo.Migrations.AddPrimaryKeyToTables do
  use Ecto.Migration

  def change do
    alter table(:columns) do
      add(:primary_key, :boolean)
    end
  end
end
