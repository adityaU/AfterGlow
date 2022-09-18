defmodule AfterGlow.Repo.Migrations.Visualizations do
  use Ecto.Migration

  def change do

    create table(:visualizations) do
      add :name, :string
      add :settings, :jsonb
      add :query_terms, :jsonb
      add :renderer_type, :string
      add :question_id, references(:questions, on_delete: :nothing)

      timestamps()
    end

    create index(:visualizations, [:question_id])

  end
end
