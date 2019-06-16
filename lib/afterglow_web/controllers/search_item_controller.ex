defmodule AfterGlow.SearchItemController do
  use AfterGlow.Web, :controller
  alias AfterGlow.Repo

  alias AfterGlow.AutoComplete

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)

  def index(conn, %{"q" => query}) do
    render(conn, "index.json", %{
      ("search-items" |> String.to_atom()) =>
        AutoComplete.entity_autocomplete(query, conn.assigns.current_user)
    })
  end

  def index(conn, _params) do
    render(conn, "index.json", %{
      ("search-items" |> String.to_atom()) =>
        AutoComplete.entity_autocomplete("", conn.assigns.current_user)
    })
  end
end
