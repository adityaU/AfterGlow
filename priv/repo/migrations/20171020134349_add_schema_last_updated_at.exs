defmodule AfterGlow.Repo.Migrations.AddSchemaLastUpdatedAt do
  use Ecto.Migration

  def change do
    alter table(:databases) do
      add :schema_last_updated_at , :datetime
    end

    alter table(:tables) do
      add :schema_last_updated_at , :datetime
    end
  end
end
