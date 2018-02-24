defmodule AfterGlow.Repo.Migrations.CreateColumn do
  use Ecto.Migration

  def change do
    create table(:columns) do
      add :name, :string
      add :type, :string
      add :table_id, references(:tables, on_delete: :delete_all)

      timestamps()
    end
    create index(:columns, [:table_id])

  end
end
