defmodule AfterGlow.Repo.Migrations.CreateSheetConfigs do
  use Ecto.Migration

  def change do
    create table(:sheet_configs) do
      add :name, :string
      add :table_name, :string
      add :refresh_interval, :integer
      add :sheet_id, :string
      add :subsheet_id, :integer
      add :api_key_id, references(:user_settings, on_delete: :nothing)

      timestamps()
    end

    create index(:sheet_configs, [:api_key_id])
  end
end
