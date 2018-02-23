defmodule AfterGlow.Repo.Migrations.AddTgramIndexOnTableAndColumnName do
  use Ecto.Migration

  def up do
    execute "CREATE extension if not exists pg_trgm;"
    execute "CREATE INDEX tables_name_trgram_index ON tables USING gin (name gin_trgm_ops);"
    execute "CREATE INDEX columns_name_trgram_index ON columns USING gin (name gin_trgm_ops);"
  end

  def down do
    execute "DROP INDEX  table_name_trgram_index;"
    execute "DROP INDEX  column_name_trgram_index;"
  end
end

