
defmodule AfterGlow.SchemaTasks do
  alias AfterGlow.Sql.DbConnection
  alias AfterGlow.CacheWrapper.Repo
  alias AfterGlow.Table
  alias AfterGlow.Database
  alias AfterGlow.CacheWrapper
  alias AfterGlow.Column

  import Ecto.Query, only: [from: 2]

  def sync(db_record) do
    db_record = db_record |> Map.from_struct()
    {:ok, schema} = DbConnection.get_schema(db_record)

    schema
    |> save(db_record[:id])
  end

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
    |> Map.merge(%{inserted_at: Ecto.DateTime.utc(), updated_at: Ecto.DateTime.utc()})
    |> Repo.insert_or_update()
  end
end
