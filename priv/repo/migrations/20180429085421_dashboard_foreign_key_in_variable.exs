defmodule AfterGlow.Repo.Migrations.DashboardForeignKeyInVariable do
  use Ecto.Migration

  def change do
    drop constraint(:variables, "variables_dashboard_id_fkey")
    alter table(:variables) do
      modify :dashboard_id, references(:dashboards, on_delete: :delete_all)
    end
  end
end
