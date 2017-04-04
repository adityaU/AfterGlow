defmodule AfterGlow.Repo.Migrations.FixResultsViewSettingsInQuestion do
  use Ecto.Migration

  def change do
    alter table(:questions) do
      remove :results_view_settings
      add :results_view_settings, :jsonb
    end
  end
end
