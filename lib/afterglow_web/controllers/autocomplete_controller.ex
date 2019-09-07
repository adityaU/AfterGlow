defmodule AfterGlow.AutoCompleteController do
  use AfterGlow.Web, :controller
  alias AfterGlow.AutoComplete
  alias AfterGlow.Plugs.Authorization
  plug(Authorization)

  action_fallback(AfterGlow.Web.FallbackController)

  def complete(conn, %{"query" => query, "database_id" => database_id, "prefix" => prefix}) do
    conn
    |> json(AutoComplete.autocomplete(database_id, prefix, query))
  end

  def column_suggestions_autocomplete(conn, %{
        "query" => query,
        "database_id" => database_id,
        "table_id" => table_id,
        "column_id" => column_id
      }) do
    conn
    |> json(AutoComplete.column_suggestions_autocomplete(query, database_id, table_id, column_id))
  end
end
