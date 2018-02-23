defmodule AfterGlow.AutoComplete  do
  import Ecto.Query, warn: false
  alias AfterGlow.Table
  alias AfterGlow.Column
  alias AfterGlow.Repo

  def autocomplete(database_id, prefix) do
    tables = (from t in Table, where: ilike(t.name, ^"%#{prefix}%") and t.database_id == ^database_id, limit: 5)
    |> Repo.all()
    |> Enum.map(fn t ->
      %{name: t.name, value: t.name, meta: "table", score: 1000/(t.name |> String.length)}
    end)

    columns = (from c in Column,
      where:  ilike(c.name, ^"%#{prefix}%"),
      left_join: t in Table, on: [id: c.table_id], where: t.database_id == ^database_id, 
      limit: 5)
      |> Repo.all()
      |> Enum.map(fn c ->
      %{name: c.name, value: c.name, meta: "column", score: 1000/(c.name |> String.length)}
    end)

    tables ++ columns
  end
end

