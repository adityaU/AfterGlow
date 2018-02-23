defmodule AfterGlow.Repo.Migrations.CreateSnapshots do
  use Ecto.Migration

  def change do
    create table(:snapshots) do
      add :name, :string, null: false
      add :description, :string
      add :columns, {:array, :string}
      add :question_id, references(:questions, on_delete: :nothing), null: false

      timestamps()
    end

    create index(:snapshots, [:question_id])
  end
end
