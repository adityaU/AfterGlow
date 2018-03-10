require IEx

defmodule AfterGlow.ColumnValuesTasks do
  alias AfterGlow.Repo
  alias AfterGlow.Table
  alias AfterGlow.Column
  alias AfterGlow.ColumnValue

  import Ecto.Query, only: [from: 2]

  def save(table_id, results) do
    table = Repo.one(from(t in Table, where: t.id == ^table_id)) |> Repo.preload(:columns)
    columns = table.columns
    column_ids = columns |> Enum.map(fn column -> column.id end)

    values =
      format(columns, results)
      |> Enum.reject(fn x -> is_nil(x) end)
      |> Enum.map(fn v ->
        v
        |> Map.merge(%{inserted_at: Ecto.DateTime.utc(), updated_at: Ecto.DateTime.utc()})
      end)

    # a uniqueness check on database prevents duplicate entries.
    Repo.insert_all(ColumnValue, values, on_conflict: :nothing)
  end

  defp format(columns, results) do
    data =
      columns
      |> Enum.map(fn column ->
        index = results.columns |> Enum.find_index(fn el -> el == column.name end)

        if index >= 0 do
          IO.inspect(column.name)
          # compact
          values =
            results.rows
            |> Enum.map(fn row ->
              value = row |> List.to_tuple() |> elem(index)

              if saving_allowed(value) and can_be_a_string(Kernel.to_string(value)) do
                %{column_id: column.id, value: Kernel.to_string(value)}
              else
                nil
              end
            end)
            |> Enum.uniq()
            |> Enum.reject(&is_nil(&1))

          if values |> length <= 20 do
            values
          end
        end
      end)

    data |> List.flatten()
  end

  defp saving_allowed(value) when is_binary(value), do: true
  defp saving_allowed(value) when is_integer(value), do: true
  defp saving_allowed(value) when is_boolean(value), do: true
  defp saving_allowed(value), do: false

  defp can_be_a_string(value), do: String.length(value) < 255
end
