defmodule AfterGlow.Repo.Migrations.AddMoreFieldsToColumns do
  use Ecto.Migration

  def change do
    alter table(:columns) do
      remove :type
      add :data_type, :string
    end
  end
end
