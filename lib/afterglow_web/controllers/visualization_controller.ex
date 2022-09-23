defmodule AfterGlow.VisualizationController do
  use AfterGlow.Web, :controller

  alias AfterGlow.Visualizations.Visualizations

  alias JaSerializer.Params

  alias AfterGlow.Plugs.Authorization
  alias AfterGlow.QueryView

  plug(Authorization)

  action_fallback(AfterGlow.Web.FallbackController)

  def index(conn, %{"question_id" => question_id}) do
    vizs = Visualizations.find_by_question_id(question_id)
    conn |> json(%{visualizations: vizs})
  end

  def create(conn, %{"visualizations" => vizs, "question_id" => question_id}) do
    visualizations = Visualizations.save(vizs, question_id)
    conn |> json(%{visualizations: visualizations})
  end

  def delete(conn, %{"id" => id}) do
    Visualizations.delete(id)
    send_resp(conn, :no_content, "")
  end

  def results(conn, payload) do
    {res, query, additional_info} = Visualizations.results(payload["id"], payload, conn.assigns.current_user) 
    additional_info |> IO.inspect(label: "additional_info")
    case res do
      {:ok, results} ->
        results = results |> Map.merge(%{original_query_columns: additional_info.columns,
        column_details: (get_in(results, [:column_details]) || %{}) |> Map.merge( get_in(additional_info, [:column_details] ) || %{})
        })
        conn
        |> render(QueryView, "execute.json", data: results, query: query)

      {:error, error} ->
        error = error |> Map.merge(%{
        original_query_columns: get_in(additional_info, [:columns]) || [],
        column_details: get_in(additional_info, [:column_details]) || %{},
        additional_filters_applied: get_in(additional_info, [:query_terms_applied])
        }) 
        conn
        |> put_status(:unprocessable_entity)
        |> render(QueryView, "execute.json", error: error, query: query)
    end
  end
end
