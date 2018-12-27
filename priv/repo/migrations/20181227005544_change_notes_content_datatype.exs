defmodule AfterGlow.Repo.Migrations.ChangeNotesContentDatatype do
  use Ecto.Migration

  def change do
    alter table(:notes) do
      modify(:content, :text)
    end
  end
end
