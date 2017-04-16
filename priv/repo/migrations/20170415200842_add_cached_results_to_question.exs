defmodule AfterGlow.Repo.Migrations.AddCachedResultsToQuestion do
  use Ecto.Migration

  def change do
    alter table(:questions) do
      add :cached_results, :jsonb
    end

  end
end
