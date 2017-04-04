defmodule AfterGlow.Repo.Migrations.CreateTable do
  use Ecto.Migration

  def change do
    create table(:tables) do
      add :name, :string
      add :database_id, references(:databases, on_delete: :nothing)

      timestamps()
    end
    create index(:tables, [:database_id])

  end
end
