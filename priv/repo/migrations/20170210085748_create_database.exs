defmodule SimpleBase.Repo.Migrations.CreateDatabase do
  use Ecto.Migration

  def change do
    create table(:databases) do
      add :name, :string
      add :db_type, :string
      add :config, :map

      timestamps()
    end

  end
end
