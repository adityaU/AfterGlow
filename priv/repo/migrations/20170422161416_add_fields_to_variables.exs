defmodule AfterGlow.Repo.Migrations.AddFieldsToVariables do
  use Ecto.Migration

  def change do
    alter table(:variable_questions) do
      remove :variable_id
      add :name, :string
      add :default, :string
    end

    alter table(:variable_dashboards) do
      remove :variable_id
      add :name, :string
      add :default, :string
    end

    drop table(:variables)

    create unique_index(:variable_dashboards, [:dashboard_id, :name])
    create unique_index(:variable_questions, [:question_id, :name])

  end
end
