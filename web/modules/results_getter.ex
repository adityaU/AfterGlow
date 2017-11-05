defmodule AfterFlow.ResultsGetter do
  alias AfterGlow.RedixConnection
  def get_for(query_key, page) do
    backend_page = translate_to_backend_page(page)
    rows_redis_key = query_key <> "::" <> Integer.to_string(backend_page)
    columns_redis_key = query_key <> "::" <> "columns"
    total_results_redis_key = query_key <> "::" <> "total_results"
    {:ok, rows} = RedixConnection.command(["GET", rows_redis_key])
    {:ok, columns} = RedixConnection.command(["GET", columns_redis_key])
    {:ok, total_results} = RedixConnection.command(["GET", total_results_redis_key])
    %{columns: columns |> IO.inspect |> Poison.decode!,
      rows: rows |> IO.inspect |> Poison.decode!,
      total_results: total_results,
      offset: offset(page),
      pages_start: pages_start(page),
      pages_end: pages_end(page)
    }
  end

  defp translate_to_backend_page page do
    (page*10)/200 |> Float.ceil |> round
  end

  defp offset(page) do
    (page - 1)*10 |> rem(200)
  end

  defp pages_start(page) do
    (((page*10)/200 |> round)* 200 + 1)/10 |> Float.ceil |> round
  end

  defp pages_end(page) do
    pages_start(page) + 19
  end
end
