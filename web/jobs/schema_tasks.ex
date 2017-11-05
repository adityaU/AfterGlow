defmodule AfterGlow.SchemaTasks do
  require IEx
  alias AfterGlow.Sql.DbConnection
  alias AfterGlow.Repo
  alias AfterGlow.Database
  alias AfterGlow.Table
  alias AfterGlow.Column

  import Ecto.Query, only: [from: 2]

  def update_tables db_record do
    saved_tables = Repo.all(from t in Table, where: t.database_id == ^db_record.id, select: t.name) |> IO.inspect
    new_tables = get_new_tables(db_record.db_url) |> IO.inspect

    to_be_deleted_tables = saved_tables -- new_tables |> IO.inspect
    to_be_created_tables = new_tables -- saved_tables |> IO.inspect

    create_new_tables(to_be_created_tables, db_record.id) |> IO.inspect
    delete_old_tables(to_be_deleted_tables, db_record.id) |> IO.inspect

    update_database_schema_last_updated_at(db_record)
  end


  defp create_new_tables(tables, db_id) do
    tables
    |> Enum.each(fn t ->
      Table.create(t, db_id) |> IO.inspect
    end)
  end

  defp delete_old_tables(tables, db_id) do
    tables
    |> Enum.each(fn t ->
      table = Repo.one(from table in Table, where: table.database_id == ^db_id and table.name == ^t )
      Repo.delete(table)
    end)
  end

  defp get_new_tables(db_url) do
    payload = "{\"args\" : [\"#{db_url}\"]}"
    {:ok, resp} = HTTPoison.post(
      Application.get_env(:afterglow, :worker_url) <> "/api/task/apply/query_runner.get_tables",
      payload,
      [{"Content-Type" , "application/json"}],
      [recv_timeout: 100000]
    )
    {:ok, resp} = Poison.decode(resp.body)
    resp["result"] |> IO.inspect
  end

  defp update_database_schema_last_updated_at db_record do
    changeset = Ecto.Changeset.change(db_record, schema_last_updated_at: Ecto.DateTime.utc)
    Repo.update(changeset)
  end


  def update_columns table do
    database = Repo.one(from d in Database, where: d.id == ^table.database_id)
    saved_columns = Repo.all(from c in Column, where: c.table_id == ^table.id, select: [c.name, c.data_type])
    new_columns = get_new_columns(database.db_url, table.name) |> Enum.map(fn c ->
      [c["name"], c["type"]]
    end) |> IO.inspect

    to_be_deleted_columns = saved_columns -- new_columns |> IO.inspect
    to_be_created_columns = new_columns -- saved_columns |> IO.inspect

    create_new_columns(to_be_created_columns, table.id) |> IO.inspect
    delete_old_columns(to_be_deleted_columns, table.id) |> IO.inspect

    update_table_schema_last_updated_at(table)
  end


  defp create_new_columns(columns, table_id) do
    columns
    |> Enum.each(fn c ->
      Column.create(c, table_id) |> IO.inspect
    end)
  end

  defp delete_old_columns(columns, table_id) do
    columns
    |> Enum.each(fn c ->
      column = Repo.one(from column in Column, where: column.table_id == ^table_id and column.name == ^c["name"] )
      Repo.delete(column)
    end)
  end

  defp get_new_columns(db_url, table_name) do
    payload = "{\"args\" : [\"#{db_url}\", \"#{table_name}\"]}"
    {:ok, resp} = HTTPoison.post(
      Application.get_env(:afterglow, :worker_url) <> "/api/task/apply/query_runner.get_columns",
      payload,
      [{"Content-Type" , "application/json"}],
      [recv_timeout: 100000]
    )
    {:ok, resp} = Poison.decode(resp.body)
    resp["result"] |> IO.inspect
  end

  defp update_table_schema_last_updated_at table do
    changeset = Ecto.Changeset.change(table, schema_last_updated_at: Ecto.DateTime.utc)
    Repo.update(changeset)
  end

  
  def sync db_record do
    db_record = db_record |> Map.from_struct
    {:ok, schema} = DbConnection.get_schema(db_record)
    schema
    |> save(db_record[:id])
  end


  defp save schema, db_id do
    tables = Repo.all(from t in Table, where: t.database_id == ^db_id, select: t.name)
    schema
    |> Enum.map(fn record->
      save_table_and_columns(record, db_id, tables)
    end)
  end

  defp save_table_and_columns record, db_id , tables do
    if !(tables |> Enum.member?(record["table_name"])) do
      table_changeset = Table.changeset(%Table{}, %{name: record["table_name"], readable_table_name: record["readable_table_name"], database_id: db_id})
      Repo.transaction fn ->
        table = Repo.insert!(table_changeset)

        # Build a comment from the post struct
        columns = record["columns"]
        |> Enum.map(fn x->
          Column.changeset(%Column{}, %{name: x["name"], data_type: x["data_type"] , table_id: table.id}).changes
          |> Map.merge(%{inserted_at: Ecto.DateTime.utc, updated_at:   Ecto.DateTime.utc})
        end)
        Repo.insert_all(Column, columns)
      end
      
    end
    
  end

end
