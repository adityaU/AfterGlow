defmodule AfterGlow.Repo.Migrations.AddIndexedAndautocompleteColumnsToSnapshot do
  use Ecto.Migration

  def change do
    alter table(:snapshots) do
      add(:searchable_columns, {:array, :string})
      add(:keep_latest, :integer)
    end

    alter table(:snapshot_data) do
      add(:identifier, :uuid)
    end

    alter table(:searchable_columns) do
      remove(:snapshot_data_id)
      add(:snapshot_data_identifier, :uuid)
    end

    create(index(:snapshot_data, [:identifier]))
  end
end
