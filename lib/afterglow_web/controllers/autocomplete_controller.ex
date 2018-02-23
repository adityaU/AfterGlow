defmodule AfterGlow.AutoCompleteController do
  use AfterGlow.Web, :controller

  alias AfterGlow.AutoComplete
  alias AfterGlow.Plugs.Authorization
  plug Authorization

  action_fallback AfterGlow.Web.FallbackController

  def complete(conn, %{"database_id" => database_id, "prefix" => prefix}) do
    conn
    |> json AutoComplete.autocomplete(database_id, prefix)
  end
end
