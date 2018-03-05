defmodule AfterGlow.Repo.Migrations.AddaddToSnapshot do
  use Ecto.Migration

  def change do
    alter table(:snapshots) do
      add :scheduled, :boolean
      add :interval, :integer
      add :starting_at, :utc_datetime
      add :status, :integer
      add :should_save_data_to_db, :boolean
      add :should_create_csv, :boolean
      add :should_send_mail_on_completion, :boolean
      add :mail_to, {:array, :string}
      add :parent_id, references(:snapshots, on_delete: :nothing)
    end
  end
end
