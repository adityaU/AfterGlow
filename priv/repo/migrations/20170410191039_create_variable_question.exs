defmodule AfterGlow.Repo.Migrations.CreateVariableQuestion do
  use Ecto.Migration

  def change do
    create table(:variable_questions) do
      add :question_id, references(:questions, on_delete: :delete_all)
      add :variable_id, references(:variables, on_delete: :delete_all)

      timestamps()
    end
    create index(:variable_questions, [:question_id])
    create index(:variable_questions, [:variable_id])

  end
end
