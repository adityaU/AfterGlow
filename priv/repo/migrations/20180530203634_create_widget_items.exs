defmodule AfterGlow.Repo.Migrations.CreateWidgetItems do
  use Ecto.Migration

  def change do
    create table(:widget_items) do
      add(:text, :string)
      add(:config, :jsonb)
      add(:value, :string)
      add(:widget_id, references(:widgets, on_delete: :delete_all, on_replace: :delete))
      timestamps()
    end
  end
end
