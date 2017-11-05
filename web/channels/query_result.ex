defmodule AfterGlow.QueryResultChannel do
  use Phoenix.Channel

  alias AfterFlow.ResultsGetter

  require IEx

  def join("query_result:" <> query_result_id, params, socket) do
    {:ok, socket}
  end

  def handle_in("get_results", %{"query_key" => query_key, "page" => page} , socket) do
    push socket, "get_results",  ResultsGetter.get_for(query_key, page)
    {:noreply, socket}
  end

  def handle_out(event, payload, socket) do
    push socket, event, payload
    {:noreply, socket}
  end

end
