defmodule AfterGlow.Repo.Migrations.AddIsActiveToUser do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add(:is_deactivated, :boolean)
    end
  end
end
