defmodule AfterGlow.Repo.Migrations.CreateQuestion do
  use Ecto.Migration

  def change do
    create table(:questions) do
      add :title, :string
      add :update_interval, :integer
      add :last_updated, :utc_datetime
      add :sql, :text
      add :human_sql, :map

      timestamps()
    end

  end
end
