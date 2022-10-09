defmodule AfterGlow.ResultsCache.QueryFunctions do
  @model AfterGlow.ResultsCache.Model
  @default_preloads []
  import Ecto.Query

  alias AfterGlow.Async

  use AfterGlow.Utils.Models.Crud

  def get_by(key, sql) do
    from_cache =
      from(m in @model,
        where: m.key == ^key and m.sql == ^sql and m.expiry_time > ^Timex.now(),
        order_by: [desc: :expiry_time],
        limit: 1
      )
      |> Repo.all()
      |> Enum.at(0)

    if from_cache, do: {from_cache.updated_at, from_cache.expiry_time, from_cache.data}, else: {nil, nil, nil}
  end

  def set(key, sql, expire_after, data) do
    %{
      key: key,
      sql: sql,
      expiry_time: Timex.shift(Timex.now(), seconds: parse_integer(expire_after)),
      data: data
    }
    |> create()
    from(m in @model, where: m.expiry_time < ^Timex.now()) |> Repo.delete_all
  end

  def set_async(key, sql, expire_after, data) do
    Async.perform(&set/4, [key, sql, expire_after, data])
  end

  defp parse_integer(x) when is_binary(x), do: Integer.parse(x) |> elem(0)
  defp parse_integer(x) when is_integer(x), do: x
  defp parse_integer(x), do: nil
end
