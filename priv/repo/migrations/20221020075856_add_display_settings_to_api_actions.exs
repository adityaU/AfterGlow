defmodule AfterGlow.Repo.Migrations.AddDisplaySettingsToApiActions do
  use Ecto.Migration

  def change do
    alter table(:api_actions) do
      add(:display_settings, :jsonb)
    end
  end
end
