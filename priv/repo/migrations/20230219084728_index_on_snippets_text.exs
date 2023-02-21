defmodule AfterGlow.Repo.Migrations.IndexOnSnippetsText do
  use Ecto.Migration

  def up do
    execute("CREATE extension if not exists pg_trgm;")
    execute("CREATE INDEX snippets_text_trgram_index ON snippets USING gin (text gin_trgm_ops);")
  end

  def down do
    execute("DROP INDEX  snippets_text_trgram_index;")
  end
end
