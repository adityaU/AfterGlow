defmodule AfterGlow.DashboardController do
  use AfterGlow.Web, :controller

  alias AfterGlow.Dashboard
  alias AfterGlow.Question
  alias AfterGlow.Tag
  alias AfterGlow.Widgets.DwQueryFunctions, as: Widgets
  import Ecto.Query

  alias AfterGlow.Variable

  alias AfterGlow.Dashboards.DQQueryFunctions, as: DashboardQuestions
  alias JaSerializer.Params
  alias AfterGlow.CacheWrapper
  alias AfterGlow.CacheWrapper.Repo
  alias AfterGlow.Plugs.Authorization
  plug(Authorization)
  plug(:authorize!, Dashboard)
  plug(:scrub_params, "data" when action in [:create, :update])
  plug(:verify_authorized)

  def index(conn, %{"id" => id, "share_id" => share_id}) when share_id != nil do
    dashboard =
      CacheWrapper.get_by_id(id |> Integer.parse() |> elem(0), Dashboard)
      |> Repo.preload(:questions)
      |> Repo.preload(:tags)
      |> Repo.preload(:variables)
      |> Repo.preload(:notes)

    if dashboard.shareable_link == share_id do
      changeset =
        Dashboard.changeset(dashboard, %{
          shared_to:
          dashboard.shared_to |> Kernel.++([conn.assigns.current_user.email]) |> Enum.uniq()
        })

      {:ok, dashboard} = Dashboard.update(changeset, dashboard.questions, dashboard.tags)
      render(conn, :show, data: dashboard)
    else
      send_404_response(conn)
    end
  end

  def show(conn, %{"id" => id, "share_id" => share_id}) do
    if share_id do
      dashboard =
        CacheWrapper.get_by_id(id |> Integer.parse() |> elem(0), Dashboard)
        |> Repo.preload(:questions)
        |> Repo.preload(:tags)
        |> Repo.preload(:variables)
        |> Repo.preload(:notes)
      if dashboard.shareable_link == share_id do
        changeset =
          Dashboard.changeset(dashboard, %{
            shared_to:
            dashboard.shared_to |> Kernel.++([conn.assigns.current_user.email]) |> Enum.uniq()
          })

        {:ok, dashboard} = Dashboard.update(changeset, dashboard.questions, dashboard.tags)
      end
    end
    dashboard =
      scope(conn, Dashboard)
      |> select([:id])
      |> Repo.get!(id)

    dashboard =
      CacheWrapper.get_by_id(dashboard.id, Dashboard)
      |> Repo.preload(:questions)
      |> Repo.preload(:tags)
      |> Repo.preload(:variables)
      |> Repo.preload(:notes)

    render(conn, :show, data: dashboard)
  end

  def index(conn, %{"id" => id}) do
    dashboard =
      scope(conn, Dashboard)
      |> select([:id])
      |> Repo.get!(id)

    dashboard =
      CacheWrapper.get_by_id(dashboard.id, Dashboard)
      |> Repo.preload(:questions)
      |> Repo.preload(:tags)
      |> Repo.preload(:variables)
      |> Repo.preload(:notes)

    render(conn, :show, data: dashboard)
  end

  def index(conn, params) do
    dashboards =
      scope(conn, Dashboard)
      |> select([:id])
      |> limit_by_params(params)
      |> Repo.all()
      |> Enum.map(fn x -> x.id end)
      |> CacheWrapper.get_by_ids(Dashboard)
      |> Repo.preload(:questions)
      |> Repo.preload(:tags)
      |> Repo.preload(:variables)
      |> Repo.preload(:notes)

    conn
    |> render(:index, data: dashboards)
  end

  def create(conn, %{
    "data" => data = %{"type" => "dashboards", "attributes" => _dashboard_params}
  }) do
    prms = Params.to_attributes(data)
    prms = prms |> Map.merge(%{"owner_id" => conn.assigns.current_user.id})
    changeset = Dashboard.changeset(%Dashboard{}, prms)
    question_ids = prms["questions_ids"]

    questions =
      unless question_ids && question_ids |> Enum.empty?() do
        nil
      else
        Repo.all(from(q in Question, where: q.id in ^question_ids))
      end

    case Dashboard.insert(changeset, questions) do
      {:ok, dashboard} ->
        dashboard =
          dashboard
          |> Repo.preload(:questions)
          |> Repo.preload(:tags)
          |> Repo.preload(:variables)
          |> Repo.preload(:notes)

        conn
        |> put_status(:created)
        |> put_resp_header("location", dashboard_path(conn, :show, dashboard))
        |> render(:show, data: dashboard)

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def update(conn, %{
    "id" => id,
    "data" => data = %{"type" => "dashboards", "attributes" => _dashboard_params}
  }) do
    prms = Params.to_attributes(data)

    dashboard =
      scope(conn, Dashboard)
      |> Repo.get!(id)
      |> Repo.preload(:questions)
      |> Repo.preload(:tags)
      |> Repo.preload(:variables)
      |> Repo.preload(:notes)

    changeset = Dashboard.changeset(dashboard, prms)

    question_ids =
      prms["questions_ids"] ||
        DashboardQuestions.get_question_ids_from_settings(prms)

    questions =
      if !question_ids || (question_ids && question_ids |> Enum.empty?()),
        do: nil,
        else: Repo.all(from(q in Question, where: q.id in ^question_ids))

    tag_ids = prms["tags_ids"]

    tags =
      if !tag_ids || (tag_ids && tag_ids |> Enum.empty?()),
        do: nil,
        else: Repo.all(from(t in Tag, where: t.id in ^tag_ids))

    case Dashboard.update(changeset, questions, tags) do
      {:ok, dashboard} ->
        Widgets.sync(dashboard)

        dashboard =
          dashboard |> Repo.preload(:questions) |> Repo.preload(:tags) |> Repo.preload(:variables)

        render(conn, :show, data: dashboard)

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    dashboard = scope(conn, Dashboard) |> Repo.get!(id)
    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete_with_cache(dashboard)
    send_resp(conn, :no_content, "")
  end

  defp send_404_response(conn) do
    conn
    |> put_status(:not_found)
    |> render(:errors, data: %{error: "not-found"})
  end

  defp limit_by_params(query, %{"limit" => limit}) do
    query |> limit(^limit)
  end

  defp limit_by_params(query, _params), do: query
end
