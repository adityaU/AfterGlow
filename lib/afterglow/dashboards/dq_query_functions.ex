defmodule AfterGlow.Dashboards.DQQueryFunctions do
  @model AfterGlow.Dashboards.DashboardQuestion
  @default_preloads []
  use AfterGlow.Utils.Models.Crud
  alias AfterGlow.CacheWrapper.Repo
  alias AfterGlow.Utils.Integer
  alias AfterGlow.Visualizations.Visualizations

  import Ecto.Query, only: [from: 2]

  def get_question_ids_from_settings(dashboard) do
    dqs = get_in(dashboard, ["settings", "widgets"])

    dqs =
      if dqs do
        dqs
        |> Enum.map(fn dq ->
          case dq["type"] do
            "question" ->
              Integer.parse_integer(dq["widID"])

            "visualization" ->
              get_question_id_from_visualization_id(Integer.parse_integer(dq["widID"]))

            _ ->
              nil
          end
        end)
      else
        []
      end
      |> Enum.filter(fn dq ->
        dq != nil
      end)
  end

  def sync(dashboard) do
    from(m in @model, where: m.dashboard_id == ^dashboard.id)
    |> Repo.delete_all()

    dqs = get_in(dashboard.settings, ["widgets"])

    dqs =
      if dqs do
        dqs
        |> Enum.map(fn dq ->
          id =
            case dq["type"] do
              "question" ->
                Integer.parse_integer(dq["widID"])

              "visualization" ->
                get_question_id_from_visualization_id(Integer.parse_integer(dq["widID"]))

              _ ->
                nil
            end

          [
            question_id: id,
            dashboard_id: dashboard.id
          ]
        end)
      else
        []
      end
      |> Enum.filter(fn dq ->
        dq |> Keyword.get(:question_id) != nil
      end)

    Repo.insert_all(@model, dqs)
  end

  def get_question_id_from_visualization_id(id) do
    case Visualizations.get(id) do
      {:ok, viz} -> viz.question_id
      _ -> nil
    end
  end
end
