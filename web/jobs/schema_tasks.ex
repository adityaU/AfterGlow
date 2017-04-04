require IEx
defmodule AfterGlow.SchemaTasks do
  alias AfterGlow.Sql.DbConnection
  alias AfterGlow.Repo
  alias AfterGlow.Database
  alias AfterGlow.Table
  alias AfterGlow.Column

  import Ecto.Query, only: [from: 2]
  
  def sync db_record do
    db_record = db_record |> Map.from_struct
    {:ok, schema} = DbConnection.get_schema(db_record)
    schema
    |> save(db_record[:id])
  end


  defp save schema, db_id do
    tables = Repo.all(from t in Table, where: t.database_id == ^db_id, select: t.name)
    schema
    |> IO.inspect
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
