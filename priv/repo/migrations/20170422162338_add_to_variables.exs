defmodule AfterGlow.Repo.Migrations.AddToVariables do
  use Ecto.Migration

  def change do
    drop table(:variable_dashboards)
    drop table(:variable_questions)

    create table(:variables) do
      add :name, :string
      add :default, :string
      add :var_type, :string
      add :column_id, references(:columns, on_delete: :delete_all)
      add :question_id, references(:questions, on_delete: :delete_all)
      add :dashboard_id, references(:questions, on_delete: :delete_all)
      add :default_operator, :string
      timestamps()
    end

  end
end
