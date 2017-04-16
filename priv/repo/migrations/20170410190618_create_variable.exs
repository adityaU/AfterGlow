defmodule AfterGlow.Repo.Migrations.CreateVariable do
  use Ecto.Migration

  def change do
    create table(:variables) do
      add :name, :string
      add :default, :string
      add :type, :string
      add :column_id, references(:columns, on_delete: :delete_all)


      timestamps()
    end

  end
end
