defmodule AfterGlow.Repo.Migrations.Snippets do
  use Ecto.Migration

  def change do
    create table(:snippets, primary_key: false) do
      add(:id, :bigserial, primary_key: true)
      add(:name, :string)
      add(:text, :text)
      add(:database_id, references(:databases, on_delete: :delete_all))
      add(:owner_id, references(:users))
      add(:expand_on_select, :bool)
      timestamps()
    end

    create(index(:snippets, [:database_id]))
    create(index(:snippets, [:owner_id]))
    create(unique_index(:snippets, [:name, :database_id]))
  end
end
