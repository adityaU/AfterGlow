defmodule AfterGlow.SchemaTasks do
  alias AfterGlow.Sql.DbConnection
  alias AfterGlow.CacheWrapper.Repo
  alias AfterGlow.Table
  alias AfterGlow.Database
  alias AfterGlow.ForeignKey
  alias AfterGlow.CacheWrapper
  alias AfterGlow.Column

  import Ecto.Query, only: [from: 2]

  def sync(db_record) do
    og_db_record = db_record
    db_record = db_record |> Map.from_struct()
    {:ok, schema} = DbConnection.get_schema(db_record)

    schema
    |> save(db_record[:id])

    DbConnection.get_primary_keys(db_record)
    |> save_primary_keys(db_record[:id])

    DbConnection.get_fkeys(db_record)
    |> save_fkeys(og_db_record)
  end

  defp save_fkeys(fkeys, db_record) do
    db_record = db_record |> Repo.preload(:tables)

    tables =
      db_record.tables
      |> Repo.preload(:columns)

    # tables
    # |> Enum.each(fn t ->
    #   t.columns
    #   |> remove_extra_fkeys(fkeys)
    # end)

    columns = tables |> Enum.map(fn x -> x.columns end) |> List.flatten()

    fkeys
    |> add_fkeys(columns)
  end

  defp save_primary_keys(primary_keys, db_id) do
    primary_keys
    |> Enum.each(fn pkey_record ->
      table =
        from(t in Table, where: t.name == ^pkey_record["table_name"] and t.database_id == ^db_id)
        |> Repo.all()
        |> Enum.at(0)

      if table do
        primary_key_column =
          from(
            c in Column,
            where: c.name == ^pkey_record["column_name"] and c.table_id == ^table.id
          )
          |> Repo.one()

        changeset = Column.changeset(primary_key_column, %{primary_key: true})

        Repo.update!(changeset)
      end
    end)
  end

  defp add_fkeys(fkeys, columns) do
    columns = columns |> Repo.preload(:table)

    fkeys
    |> Enum.each(fn fk ->
      column =
        columns
        |> Enum.filter(fn col ->
          col.table.name == fk["table_name"] && col.name == fk["column_name"]
        end)
        |> Enum.at(0)

      foreign_column =
        columns
        |> Enum.filter(fn col ->
          col.table.name == fk["foreign_table_name"] && col.name == fk["foreign_column_name"]
        end)
        |> Enum.at(0)

      if column && foreign_column do
        changeset =
          ForeignKey.changeset(%ForeignKey{}, %{
            name: fk["name"],
            fk_type: "fk",
            column_id: column.id,
            foreign_column_id: foreign_column.id
          })

        Repo.insert_or_update(changeset)
      end
    end)
  end

  # defp remove_extra_fkeys(columns, fkeys) do
  #   fkey_names = fkeys |> Enum.map(fn fk -> fk["name"] end)

  #   columns =
  #     columns
  #     |> Repo.preload(:foreign_keys)

  #   columns
  #   |> Enum.map(fn x -> x.foreign_keys end)
  #   |> List.flatten()
  #   |> Enum.filter(fn fk ->
  #     !(fk.name |> Enum.member?(fkey_names)) ||
  #       !(fk.fk_type |> Enum.member?(["guess", "user_defined"]))
  #   end)
  # end

  defp save(schema, db_id) do
    Repo.all(from(t in Table, where: t.database_id == ^db_id))
    |> remove_extra_tables(schema)

    schema
    |> Enum.map(fn record ->
      save_table_and_columns(record, db_id)
    end)
  end

  defp remove_extra_tables(tables, schema) do
    new_tables =
      schema
      |> Enum.map(fn x -> x["table_name"] end)

    tables
    |> Enum.filter(fn t ->
      !(new_tables |> Enum.member?(t.name))
    end)
    |> Enum.each(fn x ->
      Repo.delete_with_cache(x)
    end)

    tables
  end

  defp remove_extra_columns(columns, new_columns) do
    new_columns =
      new_columns
      |> Enum.map(fn x -> x["name"] end)

    columns
    |> Enum.filter(fn c ->
      !(new_columns |> Enum.member?(c.name))
    end)
    |> Enum.each(fn x ->
      Repo.delete_with_cache(x)
    end)

    columns
  end

  defp save_table_and_columns(record, db_id) do
    Repo.transaction(fn ->
      {:ok, table} = insert_or_update_table(record, db_id)
      new_columns = record["columns"]

      Repo.all(from(t in Column, where: t.table_id == ^table.id))
      |> remove_extra_columns(new_columns)

      new_columns
      |> Enum.map(fn x ->
        insert_or_update_column(x, table.id)
      end)
    end)
  end

  defp insert_or_update_table(record, db_id) do
    query = from(t in Table, where: t.name == ^record["table_name"] and t.database_id == ^db_id)
    CacheWrapper.delete_cache_struct(Repo.get!(Database, db_id))

    case Repo.all(query) do
      [] -> %Table{id: nil}
      tables -> tables |> Enum.at(0)
    end
    |> Table.changeset(%{
      name: record["table_name"],
      readable_table_name: record["readable_table_name"],
      database_id: db_id
    })
    |> Repo.insert_or_update()
  end

  defp insert_or_update_column(record, table_id) do
    query = from(c in Column, where: c.name == ^record["name"] and c.table_id == ^table_id)
    CacheWrapper.delete_cache_struct(Repo.get!(Table, table_id))

    case Repo.all(query) do
      [] -> %Column{id: nil}
      columns -> columns |> Enum.at(0)
    end
    |> Column.changeset(%{
      name: record["name"],
      data_type: record["data_type"],
      table_id: table_id
    })
    |> Map.merge(%{
      inserted_at: DateTime.utc_now() |> DateTime.truncate(:second),
      updated_at: DateTime.utc_now() |> DateTime.truncate(:second)
    })
    |> Repo.insert_or_update()
  end
end
