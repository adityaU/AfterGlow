defmodule AfterGlow.Repo.Migrations.IndexOnQuestionSql do
  use Ecto.Migration

  def up do
    execute("CREATE extension if not exists pg_trgm;")
    execute("CREATE INDEX questions_sql_trgram_index ON questions USING gin (sql gin_trgm_ops);")
  end

  def down do
    execute("DROP INDEX  questions_sql_trgram_index;")
  end
end
