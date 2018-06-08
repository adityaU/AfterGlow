defmodule AfterGlow.Repo.Migrations.AddTrigramIndexToWidgetName do
  use Ecto.Migration

  def up do
    execute("CREATE extension if not exists pg_trgm;")
    execute("CREATE INDEX widgets_name_trgram_index ON widgets USING gin (name gin_trgm_ops);")
  end

  def down do
    execute("DROP INDEX  widgets_name_trgram_index;")
  end
end
