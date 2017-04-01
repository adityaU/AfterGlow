defmodule SimpleBase.Repo.Migrations.CreateGeneratedAlerts do
  use Ecto.Migration

  def change do
    create table(:generated_alerts) do
      add :alert_id , references(:alerts)
      add :status, :integer
      add :failing_conditions, {:array, :jsonb} 
      timestamps()
    end
  end
end
