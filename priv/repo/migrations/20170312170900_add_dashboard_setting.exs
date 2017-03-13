defmodule SimpleBase.Repo.Migrations.AddDashboardSetting do
  use Ecto.Migration

  def change do
    alter table(:dashboards) do
      add :settings, :jsonb
    end
  end
end
