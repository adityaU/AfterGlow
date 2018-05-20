defmodule AfterGlow.Repo.Migrations.ForeignKeys do
  use Ecto.Migration

  def change do
    create table(:foreign_keys) do
      add(:name, :string)
      add(:fk_type, :integer)
      add(:column_id, references(:columns, on_delete: :delete_all))
      add(:foreign_column_id, references(:columns, on_delete: :delete_all))
      timestamps()
    end

    create(
      unique_index(
        :foreign_keys,
        [:column_id, :foreign_column_id],
        name: :fk_column_id_foreign_column_id_index
      )
    )
  end
end
