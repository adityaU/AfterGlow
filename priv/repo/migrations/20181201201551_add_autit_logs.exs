defmodule AfterGlow.Repo.Migrations.AddAutitLogs do
  use Ecto.Migration

  def change do
    create table(:audit_logs, primary_key: false) do
      add :id, :bigserial, primary_key: true
      add :whodunit, :integer
      add :table_name, :string
      add :action, :integer
      add :additional_data, :jsonb
      timestamps()
    end

    create index :audit_logs, [:action, :table_name, :whodunit]
  end
end
