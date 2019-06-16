defmodule AfterGlow.Repo.Migrations.AddTrgramToDashboardAndTags do
  use Ecto.Migration

  def up do
    execute("CREATE extension if not exists pg_trgm;")

    execute(
      "CREATE INDEX dashboard_title_trgram_index ON dashboards USING gin (title gin_trgm_ops);"
    )

    execute("CREATE INDEX database_name_trgram_index ON databases USING gin (name gin_trgm_ops);")
    execute("CREATE INDEX table_name_trgram_index ON tables USING gin (name gin_trgm_ops);")
    execute("CREATE INDEX column_name_trgram_index ON columns USING gin (name gin_trgm_ops);")
  end

  def down do
    execute("DROP INDEX  dashboard_title_trgram_index;")
    execute("DROP INDEX  database_name_trgram_index;")
    execute("DROP INDEX  column_name_trgram_index;")
    execute("DROP INDEX  table_name_trgram_index;")
  end
end
