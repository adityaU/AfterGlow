defmodule AfterGlow.Repo.Migrations.CreateQuestionWidget do
  use Ecto.Migration

  def change do
    create table(:question_widgets) do
      add(:widget_id, references(:widgets, null: false))
      add(:question_id, references(:questions, null: false))
    end
  end
end
