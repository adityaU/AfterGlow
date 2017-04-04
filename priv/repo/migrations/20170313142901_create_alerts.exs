defmodule AfterGlow.Repo.Migrations.CreateAlerts do
  use Ecto.Migration

  def change do
    create table(:alerts) do
      add :name, :string
      add :config, :jsonb
      add :question_id, references(:questions)
      
      timestamps()
    end

  end
end
