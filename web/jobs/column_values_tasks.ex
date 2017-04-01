require IEx
defmodule SimpleBase.ColumnValuesTasks do
  alias SimpleBase.Repo
  alias SimpleBase.Table
  alias SimpleBase.Column
  alias SimpleBase.ColumnValue

  import Ecto.Query, only: [from: 2]
  
  def save table_id, results do
    table = Repo.one(from t in Table, where: t.id == ^table_id) |> Repo.preload(:columns)
    columns = table.columns
    column_ids = columns |> Enum.map(fn column -> column.id end)
    values = format(columns, results)
    |> Enum.map(fn v ->
      v
      |> Map.merge(%{inserted_at: Ecto.DateTime.utc , updated_at: Ecto.DateTime.utc })
    end)
    Repo.insert_all(ColumnValue, values , on_conflict: :nothing) #a uniqueness check on database prevents duplicate entries.
  end

  defp format columns, results do
    data = columns
    |> Enum.map(fn column ->
      index = results.columns |> Enum.find_index(fn el -> el == column.name end)
      if index >= 0 do
        values = results.rows |> Enum.map(fn row ->
          value =  row |> List.to_tuple |> elem(index)
          if saving_allowed(value) and can_be_a_string(Kernel.to_string(value)) do
            %{column_id: column.id, value: Kernel.to_string(value)} 
          else
            nil
          end
        end) |> Enum.uniq |> Enum.reject(&(is_nil(&1))) #compact
        if values |> length <= 20 do
           values
        end
      end
    end)
    data |> List.flatten
  end

  defp saving_allowed(value)  when is_binary(value), do: true 
  defp saving_allowed(value)  when is_integer(value), do: true 
  defp saving_allowed(value), do: false 

  defp can_be_a_string(value), do: String.length(value) < 255 

end
