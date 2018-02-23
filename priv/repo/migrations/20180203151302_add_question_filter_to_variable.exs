defmodule AfterGlow.Repo.Migrations.AddQuestionFilterToVariable do
  use Ecto.Migration

  def change do
    alter table(:variables) do
      add :question_filter_id, references(:questions), null: true
    end

  end
end
