defmodule AfterGlow.Repo.Migrations.AddDescriptionToTablesColumns do
  use Ecto.Migration

  def change do

    alter table(:tables) do
      add :description, :string
    end

    alter table(:columns) do
      add :description, :string
    end
  end
end
