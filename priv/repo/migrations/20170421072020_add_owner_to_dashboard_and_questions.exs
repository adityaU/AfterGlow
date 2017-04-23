defmodule AfterGlow.Repo.Migrations.AddOwnerToDashboardAndQuestions do
  use Ecto.Migration

  def change do
    alter table(:questions) do
      add :owner_id, references(:users)
    end

    alter table(:dashboards) do
      add :owner_id, references(:users)
    end

    create index(:questions, [:owner_id])
    create index(:dashboards, [:owner_id])

  end
end
