defmodule AfterGlow.Repo.Migrations.AddMoreFieldsToQuestions do
  use Ecto.Migration

  def change do
    alter table(:questions) do
      remove :update_interval
      add :results_view_settings, :string
    end
  end
end
