defmodule AfterGlow.Repo.Migrations.AddTrgramIndexToQuestionsAndUsers do
  use Ecto.Migration

  def up do
    execute "CREATE extension if not exists pg_trgm;"
    execute "CREATE INDEX questions_title_trgram_index ON questions USING gin (title gin_trgm_ops);"
    execute "CREATE INDEX users_email_trgram_index ON users USING gin (email gin_trgm_ops);"
  end

  def down do
    execute "DROP INDEX  questions_title_trgram_index;"
    execute "DROP INDEX  users_email_trgram_index;"
  end
end
