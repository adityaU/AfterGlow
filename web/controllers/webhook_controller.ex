defmodule AfterGlow.WebhookController do
  use AfterGlow.Web, :controller

  require IEx

  def completed_query conn, params do
    AfterGlow.Endpoint.broadcast("query_result:#{params["query_key"]}", "completed_query", params)
    send_resp(conn, :no_content, "")
  end
end
