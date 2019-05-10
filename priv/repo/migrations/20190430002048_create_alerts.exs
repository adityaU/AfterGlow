defmodule AfterGlow.Repo.Migrations.CreateAlerts do
  use Ecto.Migration

  def change do
    create table(:alert_settings) do
      add(:name, :string, null: false)
      add(:question_id, references(:questions, on_delete: :delete_all), null: false)
      add(:column, :string, null: false)
      add(:aggregation, :integer, null: false)
      add(:number_of_rows, :integer, null: false)
      add(:operation, :integer, null: false)
      add(:traversal, :integer, null: false)
      add(:is_active, :boolean, null: false, default: true)
      add(:frequency_value_in_seconds, :integer, null: false)
      add(:start_time, :utc_datetime, null: false)
      add(:scheduled_disabled_config, :jsonb)
      add(:silent_till, :utc_datetime)
      timestamps()
    end

    create table(:alert_notification_settings) do
      add(:method, :integer, null: false)
      add(:recipients, {:array, :string}, null: false)
      add(:alert_setting_id, references(:alert_settings, on_delete: :delete_all), null: false)
      timestamps()
    end

    create(unique_index(:alert_notification_settings, [:method, :recipients, :alert_setting_id]))

    create table(:alert_level_settings) do
      add(:level, :integer, null: false)
      add(:value, :string, null: false)
      add(:alert_setting_id, references(:alert_settings, on_delete: :delete_all), null: false)
      timestamps()
    end

    create(unique_index(:alert_level_settings, [:level, :alert_setting_id]))

    create table(:alert_events, primary_key: false) do
      add(:id, :bigserial, primary_key: true)
      add(:alert_level_setting_id, references(:alert_level_settings, on_delete: :delete_all))
      add(:alert_setting_id, references(:alert_settings, on_delete: :delete_all), null: false)
      add(:alert_level, :integer, null: false)
      add(:row_numbers, {:array, :integer})
      add(:data, :jsonb)
      add(:is_data_saved, :boolean, null: false, default: true)
      timestamps()
    end
  end
end
