defmodule AfterGlow.Repo.Migrations.AddDaashboardToQuestions do
  use Ecto.Migration

  def change do
    create table(:dashboard_questions, primary_key: false) do
      add :dashboard_id, references(:dashboards)
      add :question_id, references(:questions)
    end
  end
end
