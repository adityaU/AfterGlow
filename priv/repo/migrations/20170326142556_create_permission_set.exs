defmodule SimpleBase.Repo.Migrations.CreatePermissionSet do
  use Ecto.Migration
  alias SimpleBase.Repo

  def change do
    create table(:permission_sets) do
      add :name, :string
      timestamps()
    end
    create table(:user_permission_sets) do
      add :user_id, references(:users, on_delete: :nothing)
      add :permission_set_id, references(:permission_sets, on_delete: :nothing)
      timestamps()
    end
    create table(:permissions) do
      add :permission_set_id, references(:permission_sets, on_delete: :nothing)
      add :name, :string
      timestamps()
    end
    create unique_index(:permissions, [:name, :permission_set_id])
    create unique_index(:user_permission_sets, [:user_id, :permission_set_id])
    create unique_index(:permission_sets, [:name])
  end
end
