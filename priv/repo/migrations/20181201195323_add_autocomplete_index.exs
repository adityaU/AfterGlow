defmodule AfterGlow.Repo.Migrations.AddAutocompleteIndex do
  use Ecto.Migration

  def up do
    execute "CREATE extension if not exists pg_trgm;"
    execute "CREATE extension if not exists btree_gist;"
    execute "CREATE INDEX searchable_columns_name_snapshot_id_value_trgram_index ON searchable_columns USING gist (snapshot_id, name, value gist_trgm_ops);"
  end

  def down do
    execute "DROP INDEX  autocomplete_columns_name_snapshot_id_value_trgram_index;"
  end
end
