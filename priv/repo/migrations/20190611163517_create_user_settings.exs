defmodule AfterGlow.Repo.Migrations.CreateUserSettings do
  use Ecto.Migration

  def change do
    create table(:user_settings) do
      add(:name, :string, null: false)
      add(:value, :string)
      add(:setting_type, :integer, null: false)

      add(:user_id, references(:users, on_delete: :delete_all), null: false)
      add(:api_action_id, references(:api_actions, on_delete: :delete_all))
      timestamps()
    end

    create(unique_index(:user_settings, [:name, :user_id]))

    create table(:organizations) do
      add(:name, :string, null: false)
      add(:google_domain, :string, null: false)
      add(:is_deactivated, :boolean, null: false, default: false)
      timestamps()
    end

    alter table(:users) do
      add(:organization_id, references(:organizations, on_delete: :delete_all))
    end

    create(unique_index(:organizations, [:name]))
    create(unique_index(:organizations, [:google_domain]))

    create table(:organization_settings) do
      add(:name, :string, null: false)
      add(:value, :string)
      add(:setting_type, :integer, null: false)

      add(:organization_id, references(:organizations, on_delete: :delete_all), null: false)
      add(:api_action_id, references(:api_actions, on_delete: :delete_all))
      timestamps()
    end

    create(unique_index(:organization_settings, [:name, :organization_id]))
  end
end
