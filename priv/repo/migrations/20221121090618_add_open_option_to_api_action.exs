defmodule AfterGlow.Repo.Migrations.AddOpenOptionToApiAction do
  use Ecto.Migration

  def change do
    alter table(:api_actions) do
      add(:open_option, :string)
    end

  end
end
