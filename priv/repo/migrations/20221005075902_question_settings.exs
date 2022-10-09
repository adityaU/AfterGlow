defmodule AfterGlow.Repo.Migrations.QuestionSettings do
  use Ecto.Migration

  def change do
    alter table(:questions) do
      add(:config, :jsonb)
    end
  end
end
