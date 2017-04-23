defmodule AfterGlow.Repo.Migrations.AddSharedToToQuestionsAndDashboards do
  use Ecto.Migration

  def change do
    alter table(:questions) do
      add :shared_to, {:array, :string}, null: false
    end

    alter table(:dashboards) do
      add :shared_to, {:array, :string}, null: false
    end
    create index('questions', [:shared_to], using: :gin)
    create index('dashboards', [:shared_to], using: :gin)
  end
end
