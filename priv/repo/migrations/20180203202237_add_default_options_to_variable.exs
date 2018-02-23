defmodule AfterGlow.Repo.Migrations.AddDefaultOptionsToVariable do
  use Ecto.Migration

  def change do
    alter table(:variables) do
      add :default_options, {:array, :map}
    end

  end
end
