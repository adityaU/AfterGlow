defmodule AfterGlow.Repo.Migrations.CreateDashboard do
  use Ecto.Migration

  def change do
    create table(:dashboards) do
      add :title, :string
      add :update_interval, :integer
      add :last_updated, :utc_datetime
      timestamps()
    end

  end
end
