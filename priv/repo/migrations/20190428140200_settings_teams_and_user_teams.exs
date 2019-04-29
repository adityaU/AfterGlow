defmodule AfterGlow.Repo.Migrations.SettingsTeamsAndUserTeams do
  use Ecto.Migration

  def change do
    create table(:settings) do
      add(:name, :string, null: false)
      add(:value, :text)
      timestamps()
    end

    create(unique_index(:settings, :name))

    create table(:teams) do
      add(:name, :string, null: false)
      add(:description, :text)
      timestamps()
    end

    create(unique_index(:teams, :name))

    create table(:user_teams) do
      add(:user_id, references(:users, on_delete: :delete_all))
      add(:team_id, references(:teams, on_delete: :delete_all))

      timestamps()
    end

    create table(:team_databases) do
      add(:database_id, references(:databases, on_delete: :delete_all))
      add(:team_id, references(:teams, on_delete: :delete_all))

      timestamps()
    end

    create(unique_index(:team_databases, [:database_id, :team_id]))
    create(unique_index(:user_teams, [:user_id, :team_id]))
  end
end
