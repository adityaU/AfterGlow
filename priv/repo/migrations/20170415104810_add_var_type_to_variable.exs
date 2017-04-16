defmodule AfterGlow.Repo.Migrations.AddVarTypeToVariable do
  use Ecto.Migration

  def change do
    alter table(:variables) do
      remove :type
      add :var_type, :string
      add :default_operator, :string
    end
  end
end
