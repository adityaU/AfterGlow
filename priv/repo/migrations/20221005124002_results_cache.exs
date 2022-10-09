defmodule AfterGlow.Repo.Migrations.ResultsCache do
  use Ecto.Migration

  def change do

    create table(:results_cache, primary_key: false) do
      add :id, :bigserial, primary_key: true
      add :key, :string
      add :sql, :text
      add :data, :jsonb
      add :expiry_time, :utc_datetime

      timestamps()
    end
    
    create index(:results_cache, [:key, :sql])
  end

end
