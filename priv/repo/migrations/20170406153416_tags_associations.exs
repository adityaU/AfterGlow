defmodule AfterGlow.Repo.Migrations.TagsAssociations do
  use Ecto.Migration

  def change do
    create table(:tag_questions) do
      add :tag_id, references(:tags)
      add :question_id, references(:questions)
      timestamps()
    end
    
    create table(:tag_dashboards) do
      add :tag_id, references(:tags)
      add :dashboard_id, references(:dashboards)
      timestamps()
    end

    create unique_index(:tag_dashboards, [:tag_id, :dashboard_id])
    create unique_index(:tag_questions, [:tag_id, :question_id])

  end
end
