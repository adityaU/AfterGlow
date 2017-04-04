defmodule AfterGlow.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:users) do
      [:first_name, :last_name, :full_name, :email, :metadata, :profile_pic]
      add :first_name, :string
      add :last_name, :string
      add :email, :string
      add :full_name, :string
      add :profile_pic, :string
      add :metadata, :jsonb

      timestamps()
    end

    create unique_index(:users, [:email])
  end
end
