defmodule AfterGlow.Repo.Migrations.Schedules do
  use Ecto.Migration

  def change do
    create table(:schedules, primary_key: false) do
      add(:id, :bigserial, primary_key: true)
      add(:every, :integer)
      add(:time_unit, :string)
      add(:time_details, {:array, :jsonb})
      add(:next_execution_time, :utc_datetime)
      add(:is_running, :boolean)
      add(:job_details, :jsonb)
      add(:is_active, :boolean)
      add(:recipients, {:array, :string})
      add(:timezone, :string)
      timestamps()
    end

    create(index(:schedules, [:is_active, :is_running, :next_execution_time]))
  end
end
