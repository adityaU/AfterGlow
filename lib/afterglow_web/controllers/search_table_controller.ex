defmodule AfterGlow.SearchTableController do
  use AfterGlow.Web, :controller
  alias AfterGlow.AutoComplete
  alias AfterGlow.Table
  alias AfterGlow.Plugs.Authorization
  alias AfterGlow.CacheWrapper
  plug(Authorization)

  action_fallback(AfterGlow.Web.FallbackController)

  def index(conn, %{"q" => query, "database_id" => database_id}) do
    conn
    |> render("index.json", %{
      ("search-tables" |> String.to_atom()) => AutoComplete.table_autocomplete(query, database_id)
    })
  end

  def show(conn, %{"id" => id}) do
    table = CacheWrapper.get_by_id(Table, id) |> Repo.preload(columns: :belongs_to)
    render(conn, :show, data: table)
  end

  def foreign_tables(conn, %{"id" => id}) do
    render(conn, :show, data: Table.foreign_tables(id) |> Repo.preload(columns: :belongs_to))
  end
end
