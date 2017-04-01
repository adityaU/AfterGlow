defmodule SimpleBase.Repo.Migrations.AddColumnsToQuestions do
  use Ecto.Migration

  def change do
    alter table(:questions) do
      add :columns, {:array, :string}
    end

  end
end
