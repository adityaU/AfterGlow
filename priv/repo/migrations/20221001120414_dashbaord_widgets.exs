defmodule AfterGlow.Repo.Migrations.DashbaordWidgets do
  use Ecto.Migration

  def change do
    create table(:dashboard_widgets, primary_key: false) do
      add :id, :bigserial, primary_key: true
      add :widget_type, :string
      add :widget_id, :bigint
      add(:dashboard_id, references(:dashboards, on_delete: :delete_all))
      timestamps()
    end
  end
end
