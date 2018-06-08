defmodule AfterGlow.Repo.Migrations.CreateWidgets do
  use Ecto.Migration

  def change do
    create table(:widgets) do
      add(:column_name, :string, null: false)
      add(:name, :string, null: false)
      add(:renderer, :integer)
      timestamps()
    end
  end
end
