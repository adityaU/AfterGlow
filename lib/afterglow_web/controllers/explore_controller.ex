defmodule AfterGlow.ExploreController do
  use AfterGlow.Web, :controller
  alias AfterGlow.Explorations
  alias AfterGlow.Plugs.Authorization
  plug(Authorization)

  action_fallback(AfterGlow.Web.FallbackController)

  def get_row_view(conn, %{"column_id" => column_id, "value" => value}) do
    conn
    |> json(Explorations.get_row_and_dependencies(column_id, value))
  end

  def get_dependency_view(conn, %{
        "column_id" => column_id,
        "value" => value,
        "table_id" => table_id,
        "foreign_column_id" => foreign_column_id,
        "value_column_id" => value_column_id
      }) do
    conn
    |> json(
      Explorations.get_dependency(column_id, foreign_column_id, table_id, value, value_column_id)
    )
  end
end
