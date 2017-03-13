defmodule SimpleBase.Repo.Migrations.AddMoreFieldsToQuestionsAgain do
  use Ecto.Migration

  def change do
    alter table(:questions) do
      add :query_type, :integer
      add :shareable_link, :uuid
      add :is_shareable_link_public, :boolean, default: false
    end
    
  end
end
