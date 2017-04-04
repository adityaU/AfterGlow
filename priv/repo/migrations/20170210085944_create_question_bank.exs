defmodule AfterGlow.Repo.Migrations.CreateQuestionBank do
  use Ecto.Migration

  def change do
    create table(:question_banks) do
      add :title, :string
      add :questions, {:array, :integer}

      timestamps()
    end

  end
end
