defmodule SimpleBase.Repo.Migrations.AddUniquenessCheck do
  use Ecto.Migration

  def change do
    create unique_index(:column_values, [:column_id, :value])

  end
end
