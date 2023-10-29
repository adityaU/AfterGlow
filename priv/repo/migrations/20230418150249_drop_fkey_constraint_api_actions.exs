defmodule AfterGlow.Repo.Migrations.DropFkeyConstraintApiActions do
  use Ecto.Migration

  def up do
    execute("ALTER TABLE api_action_logs DROP CONSTRAINT api_action_logs_api_action_id_fkey")
  end

  def down do
  end
end
