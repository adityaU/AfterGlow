defmodule AfterGlow.SearchTableController do
  use AfterGlow.Web, :controller
  alias AfterGlow.Column
  alias AfterGlow.AutoComplete
  alias AfterGlow.Table
  alias AfterGlow.Plugs.Authorization
  alias AfterGlow.CacheWrapper

  alias AfterGlow.Tables.QueryFunctions, as: Tables

  import Ecto.Query, only: [from: 2]

  plug(Authorization)

  action_fallback(AfterGlow.Web.FallbackController)

  def index(conn, %{
        "q" => query,
        "database_id" => database_id,
        "type" => "json",
        "only_tables" => only_tables
      }) do
    conn
    |> json(%{
      "data" => AutoComplete.table_autocomplete(query, database_id, only_tables)
    })
  end

  def index(conn, %{"q" => query, "database_id" => database_id}) do
    conn
    |> render("index.json", %{
      ("search-tables" |> String.to_atom()) =>
        AutoComplete.table_autocomplete(query, database_id, false)
    })
  end

  def show(conn, %{"id" => id, "type" => "json"}) do
    {:ok, table} = Tables.get(id)

    table =
      table
      |> Repo.preload(
        columns:
          {from(
             a in Column,
             order_by: [asc: a.name]
           ),  :belongs_to}
      )

    conn
    |> json(%{data: table})
  end

  def show(conn, %{"id" => id}) do
    table = CacheWrapper.get_by_id(Table, id) |> Repo.preload(columns: :belongs_to)
    render(conn, :show, data: table)
  end

  def foreign_tables(conn, %{"id" => id}) do
    render(conn, :show, data: Table.foreign_tables(id) |> Repo.preload(columns: :belongs_to))
  end
end
