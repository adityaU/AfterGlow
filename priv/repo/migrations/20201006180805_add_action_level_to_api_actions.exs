defmodule AfterGlow.Repo.Migrations.AddActionLevelToApiActions do
  use Ecto.Migration

  def change do
    alter table(:api_actions) do
      add(:action_level, :integer)
    end

  end
end
