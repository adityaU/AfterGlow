defmodule AfterGlow.Repo.Migrations.DropVarDashbaordIndex do
  use Ecto.Migration

  def change do
    drop(index(:variables, [:name, :dashboard_id]))
  end
end
