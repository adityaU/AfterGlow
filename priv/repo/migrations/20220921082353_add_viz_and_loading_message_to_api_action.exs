defmodule AfterGlow.Repo.Migrations.AddVizAndLoadingMessageToApiAction do
  use Ecto.Migration

  def change do
    alter table(:api_actions) do
      add(:visualization_id, :integer)
      add(:loading_message, :text)
    end
  end
end
