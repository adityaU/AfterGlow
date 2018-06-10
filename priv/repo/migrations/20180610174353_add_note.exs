defmodule AfterGlow.Repo.Migrations.AddNote do
  use Ecto.Migration

  def change do
    create table(:notes) do
      add(:content, :string, null: false)
      add(:dashboard_id, references(:dashboards, on_delete: :delete_all, on_replace: :delete))

      timestamps()
    end

    alter table(:dashboards) do
      add(:notes_settings, :jsonb)
    end
  end
end
