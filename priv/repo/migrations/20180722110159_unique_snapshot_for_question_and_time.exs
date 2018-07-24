defmodule AfterGlow.Repo.Migrations.UniqueSnapshotForQuestionAndTime do
  use Ecto.Migration

  def change do
    create(unique_index(:snapshots, [:question_id, :starting_at]))
  end
end
