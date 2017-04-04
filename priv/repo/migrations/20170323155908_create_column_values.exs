defmodule AfterGlow.Repo.Migrations.CreateColumnValues do
  use Ecto.Migration

  def change do
    create table(:column_values) do
      add :name, :string
      add :value, :string
      add :column_id, references(:columns, on_delete: :nothing)

      timestamps()
    end
    create index(:column_values, [:column_id])

  end
end
