defmodule AfterGlow.Repo.Migrations.AddMoreFieldsToDashboard do
  use Ecto.Migration

  def change do
    alter table(:dashboards) do
      add :description, :text
      add :shareable_link, :uuid
      add :is_shareable_link_public, :boolean, default: false
    end
  end
end
