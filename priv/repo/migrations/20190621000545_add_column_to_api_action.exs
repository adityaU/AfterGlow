defmodule AfterGlow.Repo.Migrations.AddColumnToApiAction do
  use Ecto.Migration

  def change do
    alter table(:api_actions) do
      add(:column, :string)
      add(:on_success, :integer)
      add(:on_failure, :integer)
      add(:failure_message, :string)
      add(:failure_key, :string)
      add(:success_message, :string)
      add(:success_key, :string)
    end
  end
end
