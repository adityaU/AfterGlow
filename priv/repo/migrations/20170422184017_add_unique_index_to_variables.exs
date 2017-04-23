defmodule AfterGlow.Repo.Migrations.AddUniqueIndexToVariables do
  use Ecto.Migration

  def change do
    create unique_index(:variables, [:name, :question_id])
    create unique_index(:variables, [:name, :dashboard_id])

  end
end
