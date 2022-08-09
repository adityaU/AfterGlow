defmodule AfterGlow.Repo.Migrations.DeleteTableNameFromAuditLogs do
  use Ecto.Migration

  def change do
    alter table(:audit_logs) do
      remove(:table_name, :text)
    end
  end
end
