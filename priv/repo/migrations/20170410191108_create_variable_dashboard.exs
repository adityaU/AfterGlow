defmodule AfterGlow.Repo.Migrations.CreateVariableDashboard do
  use Ecto.Migration

  def change do
    create table(:variable_dashboards) do
      add :dashboard_id, references(:questions, on_delete: :delete_all)
      add :variable_id, references(:variables, on_delete: :delete_all)

      timestamps()
    end
    create index(:variable_dashboards, [:dashboard_id])
    create index(:variable_dashboards, [:variable_id])

  end
end
