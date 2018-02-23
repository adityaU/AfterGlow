defmodule AfterGlow.Repo.Migrations.CreateSnapshotData do
  use Ecto.Migration

  def change do
    create table(:snapshot_data) do
      add :row, :map, null: false
      add :snapshot_id, references(:snapshots, on_delete: :delete_all)

      timestamps()
    end

    create index(:snapshot_data, [:snapshot_id])
  end
end
