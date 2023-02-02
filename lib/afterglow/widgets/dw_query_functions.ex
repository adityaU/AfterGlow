defmodule AfterGlow.Widgets.DwQueryFunctions do
  @model AfterGlow.Widgets.DashboardWidget
  @default_preloads []
  use AfterGlow.Utils.Models.Crud
  alias AfterGlow.CacheWrapper.Repo
  alias AfterGlow.Dashboard

  import Ecto.Query, only: [from: 2, subquery: 1]

  def sync(dashboard) do
    from(m in @model, where: m.dashboard_id == ^dashboard.id)
    |> Repo.delete_all()

    widgets = get_in(dashboard.settings, ["widgets"])

    widgets =
      if widgets do
        widgets
        |> Enum.map(fn w ->
          [
            widget_id: convert_to_int(w["widID"]),
            widget_type: w["type"],
            dashboard_id: dashboard.id,
            inserted_at: NaiveDateTime.truncate(NaiveDateTime.utc_now(), :second),
            updated_at: NaiveDateTime.truncate(NaiveDateTime.utc_now(), :second)
          ]
        end)
      else
        []
      end

    Repo.insert_all(@model, widgets)
  end

  def sync_questions(dashboard) do
    from(m in @model, where: m.dashboard_id == ^dashboard.id)
    |> Repo.delete_all()

    widgets = get_in(dashboard.settings, ["widgets"])

    widgets =
      if widgets do
        widgets
        |> Enum.map(fn w ->
          [
            widget_id: convert_to_int(w["widID"]),
            widget_type: w["type"],
            dashboard_id: dashboard.id,
            inserted_at: NaiveDateTime.truncate(NaiveDateTime.utc_now(), :second),
            updated_at: NaiveDateTime.truncate(NaiveDateTime.utc_now(), :second)
          ]
        end)
      else
        []
      end

    Repo.insert_all(@model, widgets)
  end

  def convert_to_int(x) when is_binary(x) do
    Integer.parse(x) |> elem(0)
  end

  def convert_to_int(x) do
    x
  end
end
