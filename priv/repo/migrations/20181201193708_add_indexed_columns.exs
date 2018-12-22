defmodule AfterGlow.Repo.Migrations.AddIndexedColumns do
  use Ecto.Migration

  def change do
    create table(:searchable_columns, primary_key: false) do
      add :id, :bigserial, primary_key: true
      add :name, :string
      add :snapshot_id, references(:snapshots, on_delete: :delete_all)
      add :value, :text
      add :snapshot_data_id, references(:snapshot_data, on_delete: :delete_all)
      timestamps()
    end

    create index(:searchable_columns, [:snapshot_id, :name, :value])
    alter table(:snapshots) do
      modify :id, :bigint
    end
    alter table(:snapshot_data) do
      modify :id, :bigint
    end
  end
end
